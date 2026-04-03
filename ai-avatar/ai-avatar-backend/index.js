import { exec } from 'child_process';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ffmpegStatic from 'ffmpeg-static';
// import { MsEdgeTTS, OUTPUT_FORMAT } from 'edge-tts-node';
// import EdgeTTS from 'edge-tts-node';
// const { MsEdgeTTS, OUTPUT_FORMAT } = EdgeTTS;
// import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
// import { EdgeTTS } from '@andresaya/edge-tts';
import gTTS from 'gtts';

dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure audios directory exists
const audiosDir = path.join(__dirname, 'audios');
await fs.mkdir(audiosDir, { recursive: true });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
app.use(express.json());
app.use(cors());
app.use('/avatar', express.static(path.join(__dirname, '../ai-avatar-frontend/dist')));
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (message) => {
  const time = new Date().getTime();
  console.log(`Starting conversion for message ${message}`);

  const mp3Path = path.join(audiosDir, `message_${message}.mp3`);
  const wavPath = path.join(audiosDir, `message_${message}.wav`);
  const jsonPath = path.join(audiosDir, `message_${message}.json`);

  // Convert MP3 to WAV using bundled FFmpeg
  await execCommand(`"${ffmpegStatic}" -y -i "${mp3Path}" "${wavPath}"`);
  console.log(`Conversion done in ${new Date().getTime() - time}ms`);

  // Only run rhubarb on Windows
  const isWindows = process.platform === 'win32';
  if (isWindows) {
    const rhubarbPath = path.join(__dirname, 'rhubarb', 'rhubarb.exe');
    await execCommand(
      `"${rhubarbPath}" -f json -o "${jsonPath}" "${wavPath}" -r phonetic`
    );
    console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
  } else {
    // On Linux, write a dummy lipsync file
    const dummyLipsync = { mouthCues: [] };
    await fs.writeFile(jsonPath, JSON.stringify(dummyLipsync));
    console.log(`Skipped rhubarb on Linux, dummy lipsync written`);
  }
};

// Helper: sleep
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: call Gemini with retry on 429
const callGeminiWithRetry = async (userMessage, retries = 3, delayMs = 25000) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: `You are a virtual therapy bot named Aria, designed to provide emotional support and advice to women.
      You are part of Resqher - a women empowerment platform.
      Always be warm, supportive, and non-judgmental.
      Respond ONLY with a valid JSON array of messages (max 2). Each message must have these exact properties:
      - text: your response to the user (string)
      - facialExpression: one of these exact values: smile, sad, angry, surprised, funnyFace, default
      - animation: one of these exact values: Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba Dancing, Idle, Terrified, Angry
      Do not include any explanation or markdown, just the raw JSON array.`,
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(userMessage);
      return result.response.text();
    } catch (err) {
      if (err.status === 429 && attempt < retries) {
        let waitMs = delayMs;
        try {
          const retryDelay = err.errorDetails?.find(
            (d) => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
          )?.retryDelay;
          if (retryDelay) waitMs = (parseInt(retryDelay) + 2) * 1000;
        } catch (_) {}
        console.log(`Rate limited. Retrying in ${waitMs / 1000}s... (attempt ${attempt}/${retries})`);
        await sleep(waitMs);
      } else {
        throw err;
      }
    }
  }
};

// Generate MP3 using Edge TTS (free, no API key needed)
const generateAudio = async (text, outputPath) => {
  return new Promise((resolve, reject) => {
    const gtts = new gTTS(text, 'en');
    gtts.save(outputPath, (err) => {
      if (err) reject(err);
      else {
        console.log(`Audio saved: ${outputPath}`);
        resolve();
      }
    });
  });
};
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    res.send({
      messages: [
        {
          text: 'Hey dear... How was your day?',
          audio: await audioFileToBase64(path.join(audiosDir, 'intro_0.wav')),
          lipsync: await readJsonTranscript(path.join(audiosDir, 'intro_0.json')),
          facialExpression: 'smile',
          animation: 'Talking_1',
        },
        {
          text: "I'm here for you. Feel free to share anything on your mind!",
          audio: await audioFileToBase64(path.join(audiosDir, 'intro_1.wav')),
          lipsync: await readJsonTranscript(path.join(audiosDir, 'intro_1.json')),
          facialExpression: 'smile',
          animation: 'Talking_2',
        },
      ],
    });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('Missing GEMINI_API_KEY in .env');
    return res.status(500).send({ error: 'Gemini API key is not configured.' });
  }

  try {
    const rawText = await callGeminiWithRetry(userMessage);
    console.log('Raw Gemini response:', rawText);

    const cleanJson = rawText
      .replace(/^```json\s*\n/, '')
      .replace(/^```\s*\n/, '')
      .replace(/\n```$/, '')
      .trim();

    let messages = JSON.parse(cleanJson);
    console.log('Parsed messages:', messages);

    if (messages.messages) {
      messages = messages.messages;
    }

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const fileName = path.join(audiosDir, `message_${i}.mp3`);
      const textInput = message.text;

      // Generate audio using Edge TTS (free, no API key)
      await generateAudio(textInput, fileName);

      // Generate lipsync
      await lipSyncMessage(i);

      message.audio = await audioFileToBase64(fileName);
      message.lipsync = await readJsonTranscript(path.join(audiosDir, `message_${i}.json`));
    }

    res.send({ messages });

  } catch (error) {
    console.error('Error:', error?.message || error);
    res.status(500).send({ error: 'Something went wrong. Please try again.' });
  }
});

const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, 'utf8');
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString('base64');
};

app.listen(port, () => {
  console.log(`Resqher AI Avatar listening on port ${port}`);
});