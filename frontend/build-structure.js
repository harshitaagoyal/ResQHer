const fs = require('fs');
const path = require('path');

const directories = [
  'src/app/api/chat', 'src/app/api/closeIssue', 'src/app/api/decompose',
  'src/app/api/generate-image', 'src/app/api/generate-text', 'src/app/api/getPosts',
  'src/app/api/postbyid/[id]', 'src/app/api/save', 'src/app/create-post',
  'src/app/dashboard', 'src/app/lawbot', 'src/app/post/[id]',
  'src/app/sign-in/[[...sign-in]]', 'src/app/sign-up/[[...sign-up]]',
  'src/app/therapybot', 'src/app/user/sso-callback', 'src/assets', 'src/components/ui'
];

const files = [
  'src/app/api/chat/route.js', 'src/app/api/closeIssue/route.js', 'src/app/api/decompose/route.js',
  'src/app/api/generate-image/route.js', 'src/app/api/generate-text/route.js', 'src/app/api/getPosts/route.js',
  'src/app/api/postbyid/[id]/route.js', 'src/app/api/save/route.js', 'src/app/create-post/page.jsx',
  'src/app/dashboard/page.jsx', 'src/app/lawbot/page.jsx', 'src/app/post/[id]/page.jsx',
  'src/app/sign-in/[[...sign-in]]/page.jsx', 'src/app/sign-up/[[...sign-up]]/page.jsx',
  'src/app/therapybot/page.jsx', 'src/app/user/sso-callback/page.jsx',
  'src/components/Card.jsx', 'src/components/Header.jsx', 'src/components/ImageGen.jsx',
  'src/components/InputForm.jsx', 'src/components/LiveTitle.jsx', 'src/components/LoginDropdown.jsx',
  'src/components/ModeToggle.jsx', 'src/components/MultiStep.jsx', 'src/components/Navbar.jsx',
  'src/components/PostDetail.jsx', 'src/components/RealtimeList.jsx', 'src/components/Share.jsx',
  'src/components/SignOut.jsx', 'src/components/theme-provider.jsx', 'src/components/Timeline.jsx',
  'src/middleware.js'
];

// Create Directories
directories.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Create Empty Files
files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, '// TODO: Add component logic\n');
  }
});

console.log('✅ Haven frontend JavaScript structure successfully created!');