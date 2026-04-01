'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useClerk } from '@clerk/nextjs';
import { ArrowUp, Scale, Triangle, Check, Fingerprint } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Custom Hooks & Components
import { useTypingText } from '@/hooks/useTypingText';
import ChatMessage from '@/components/ChatMessage';

const ChatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

const promptSuggestions = [
  { text: 'Indian Law', icon: <Scale size={16} /> },
  { text: 'Indian Law IPC 320', icon: <Triangle size={16} /> },
  { text: 'Women Rights', icon: <Check size={16} /> },
  { text: 'Women Safety', icon: <Fingerprint size={16} /> },
];

export default function LawbotPage() {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const typingText = useTypingText('What can I help you with?', 40);
  const { user } = useClerk();

  const form = useForm({
    resolver: zodResolver(ChatSchema),
    defaultValues: { message: '' },
  });

  const onSubmit = async (data) => {
    const userMsg = data.message;
    setMessages((prev) => [...prev, { text: userMsg, isUser: true }]);
    form.reset();
    setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ userInput: userMsg, mode: 'lawbot' }),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      setMessages((prev) => [...prev, { text: result.reply, isUser: false }]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "I'm having trouble connecting.", isUser: false }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handlePromptClick = (text) => {
    form.setValue('message', text, { shouldValidate: true });
    form.handleSubmit(onSubmit)();
  };

  // Shared Input Component to avoid repetition
  const renderInputForm = (isCentered = false) => (
    <form onSubmit={form.handleSubmit(onSubmit)} className={`flex items-center w-full gap-2 px-4 ${isCentered ? '' : 'bg-white dark:bg-[#020617] mt-auto p-4'}`}>
      <div className="rounded-3xl flex w-full items-center bg-slate-100 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 p-1 shadow-sm">
        <Input {...form.register('message')} className="focus-within:ring-0 text-lg focus-visible:ring-0 bg-transparent rounded-3xl p-5 border-none dark:text-slate-200" placeholder="Chat with Law Bot" autoComplete="off" />
        <Button className="bg-slate-300 dark:bg-slate-700 rounded-full text-black dark:text-white mr-1" disabled={isThinking || !form.formState.isValid} type="submit">
          <ArrowUp size={24} />
        </Button>
      </div>
    </form>
  );

  if (messages.length === 0) {
    return (
      <div className="min-h-[85vh] w-full max-w-3xl mx-auto flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold tracking-wide text-gray-700 dark:text-white mb-5 text-center">{typingText}</h1>
        {renderInputForm(true)}
        <div className="mt-5 flex flex-wrap justify-center items-center gap-3 px-4">
          {promptSuggestions.map((prompt, i) => (
            <button key={i} onClick={() => handlePromptClick(prompt.text)} className="flex items-center gap-2 border border-gray-300 dark:border-slate-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-transparent">
              {prompt.icon} {prompt.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] items-center justify-between max-w-3xl w-full mx-auto">
      <div className="w-full overflow-y-auto custom-scrollbar flex-1 p-4 pb-24 space-y-4">
        {messages.map((msg, i) => <ChatMessage key={i} message={msg} user={user} />)}
        {isThinking && (
          <div className="flex items-center space-x-4 animate-pulse">
            <Skeleton className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px] bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-4 w-[200px] bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        )}
      </div>
      {renderInputForm(false)}
    </div>
  );
}