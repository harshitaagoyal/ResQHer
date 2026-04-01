'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../components/ui/input';
import { ArrowUp, Scale, Triangle, Check, Fingerprint, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClerk } from '@clerk/nextjs';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

const promptSuggestions = [
  { text: 'Indian Law', icon: <Scale className="text-gray-700 dark:text-slate-300" size={16} /> },
  {
    text: 'Indian Law IPC 320',
    icon: <Triangle className="text-gray-700 dark:text-slate-300" size={16} />,
  },
  { text: 'Women Rights', icon: <Check className="text-gray-700 dark:text-slate-300" size={16} /> },
  {
    text: 'Women Safety',
    icon: <Fingerprint className="text-gray-700 dark:text-slate-300" size={16} />,
  },
];

function Page() {
  const [messages, setMessages] = React.useState([]);
  const typingText = useTypingText('What can I help you with?',40);
  const [isThinking, setIsThinking] = React.useState(false);
  
  function useTypingText(text, speed = 100) {
    const [displayedText, setDisplayedText] = React.useState('');

    React.useEffect(() => {
      let index = 0;
      const intervalId = setInterval(() => {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        if (index === text.length) clearInterval(intervalId);
      }, speed);

      return () => clearInterval(intervalId);
    }, [text, speed]);

    return displayedText;
  }

  const { user } = useClerk();
  
  const form = useForm({
    resolver: zodResolver(ChatSchema),
    defaultValues: { message: '' },
  });

  const onSubmit = async (data) => {
    setMessages((prev) => [...prev, { text: data.message, isUser: true }]);
    form.reset();
    setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ userInput: data.message, mode: 'lawbot' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      setMessages((prev) => [...prev, { text: result.reply, isUser: false }]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "I'm having trouble connecting right now.", isUser: false }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handlePromptClick = (prompt) => {
    form.setValue('message', prompt);
    form.handleSubmit(onSubmit)();
  };

  if (messages.length === 0) {
    return (
      // 🚨 CHANGED: Added min-h-[85vh], w-full, max-w-3xl, and mx-auto to force absolute centering!
      <div className="min-h-[85vh] w-full max-w-3xl mx-auto flex flex-col items-center justify-center transition-colors duration-300">
        <h1 className="text-3xl font-extrabold tracking-wide text-gray-700 dark:text-white mb-5 text-center">
          {typingText}
        </h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center w-full gap-2 px-4"
        >
          <div className="rounded-3xl flex w-full items-center bg-slate-100 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 p-1 shadow-sm">
            <Input
              {...form.register('message')}
              className="focus-within:ring-0 ring-offset-transparent text-lg focus-visible:ring-0 bg-transparent rounded-3xl focus-visible:ring-transparent p-5 border-none dark:text-slate-200 dark:placeholder:text-slate-500"
              placeholder="Chat with Law Bot"
              autoComplete="off"
            />
            <Button
              className="bg-slate-300 dark:bg-slate-700 rounded-full text-black dark:text-white cursor-pointer mr-1 hover:bg-slate-400 dark:hover:bg-slate-600"
              disabled={isThinking || !form.formState.isValid}
              type="submit"
            >
              <ArrowUp size={24} />
            </Button>
          </div>
        </form>
        <div className="mt-5 flex flex-wrap justify-center items-center gap-3 px-4">
          {promptSuggestions.map((prompt, index) => (
            <button
              key={index}
              onClick={() =>
                handlePromptClick(
                  typeof prompt === 'string' ? prompt : prompt.text
                )
              }
              className="flex items-center gap-2 border border-gray-300 dark:border-slate-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-transparent"
            >
              {typeof prompt !== 'string' && prompt.icon}
              {typeof prompt === 'string' ? prompt : prompt.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] items-center justify-between max-w-3xl w-full mx-auto transition-colors duration-300">
      <div className="w-full overflow-y-auto rounded-md custom-scrollbar flex-1">
        <div className="flex flex-col gap-2 h-full overflow-y-auto custom-scrollbar p-4 pb-24">
          {messages.length > 0 &&
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  message.isUser ? 'justify-end' : ''
                }`}
              >
                {!message.isUser && (
                  <div className="bg-slate-800 dark:bg-slate-700 text-white rounded-full h-11 w-11 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot size={24} />
                  </div>
                )}
                <div
                  className={`py-2 px-3 rounded-md max-w-[70%] ${
                    message.isUser
                      ? 'bg-green-600 text-white self-end shadow-sm'
                      : 'bg-gray-300 dark:bg-slate-800 text-black dark:text-slate-200 self-start shadow-sm'
                  }`}
                >
                  {message.isUser ? (
                    message.text
                  ) : (
                    /* Fix for Remark version 9 className error */
                    <div className="prose dark:prose-invert max-w-none text-inherit">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                {message.isUser && user && (
                  <Image
                    src={user?.imageUrl || ''}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full flex-shrink-0 border dark:border-slate-700"
                    width={32}
                    height={32}
                  />
                )}
                {message.isUser && !user && (
                  <div className="rounded-full border dark:border-slate-700 shadow-sm h-10 w-10 flex items-center justify-center flex-shrink-0 bg-white dark:bg-slate-800">
                    <h1 className="font-semibold dark:text-slate-200">U</h1>
                  </div>
                )}
              </div>
            ))}

          {isThinking && (
            <div className="flex items-center space-x-4 animate-pulse">
              <Skeleton className="h-12 w-12 rounded-full flex-shrink-0 bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-4 w-[200px] bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {messages.length > 0 && (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center w-full gap-2 p-4 bg-white dark:bg-[#020617] mt-auto"
        >
          <div className="rounded-3xl flex w-full items-center border bg-slate-100 dark:bg-slate-800/50 border-gray-300 dark:border-slate-700 p-1 shadow-sm">
            <Input
              {...form.register('message')}
              className="focus-within:ring-0 ring-offset-transparent text-lg bg-transparent focus-visible:ring-0 rounded-3xl focus-visible:ring-transparent p-5 border-none dark:text-slate-200"
              placeholder="Chat with Law Bot"
              autoComplete="off"
            />
            <Button
              className="bg-slate-300 dark:bg-slate-700 rounded-full text-black dark:text-white cursor-pointer mr-1 hover:bg-slate-400 dark:hover:bg-slate-600"
              disabled={isThinking || !form.formState.isValid}
              type="submit"
            >
              <ArrowUp size={24} />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Page;