import { Bot } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatMessage({ message, user }) {
  const isUser = message.isUser;
  return (
    <div className={`flex items-start gap-2 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="bg-slate-800 dark:bg-slate-700 text-white rounded-full h-11 w-11 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Bot size={24} />
        </div>
      )}
      <div className={`py-2 px-3 rounded-md max-w-[70%] ${
          isUser ? 'bg-green-600 text-white self-end shadow-sm' 
                 : 'bg-gray-300 dark:bg-slate-800 text-black dark:text-slate-200 self-start shadow-sm'
        }`}>
        {isUser ? (
          message.text
        ) : (
          <div className="prose dark:prose-invert max-w-none text-inherit text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        user?.imageUrl ? (
          <Image src={user.imageUrl} alt="User Avatar" className="w-8 h-8 rounded-full flex-shrink-0 border dark:border-slate-700" width={32} height={32} />
        ) : (
          <div className="rounded-full border dark:border-slate-700 shadow-sm h-10 w-10 flex items-center justify-center flex-shrink-0 bg-white dark:bg-slate-800">
            <h1 className="font-semibold dark:text-slate-200 text-xs">U</h1>
          </div>
        )
      )}
    </div>
  );
}