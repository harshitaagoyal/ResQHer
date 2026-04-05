'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@clerk/nextjs';
import { 
  ArrowUp, Scale, Triangle, Check, Fingerprint, 
  MessageSquare, Plus, Trash2, Edit2, Menu, X, Loader2 
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { useTypingText } from '@/hooks/useTypingText';
import ChatMessage from '@/components/lawbot/ChatMessage';

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
  const [isLoadingChat, setIsLoadingChat] = useState(false); 
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const typingText = useTypingText('What can I help you with?', 40);
  const { user, isLoaded } = useUser();

  const form = useForm({
    resolver: zodResolver(ChatSchema),
    defaultValues: { message: '' },
  });

  useEffect(() => {
    if (user) fetchChats();
  }, [user]);

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/lawbot/history');
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
      }
    } catch (error) {
      console.error('Failed to fetch chats', error);
    }
  };

  const loadChatMessages = async (chatId) => {
    setActiveChatId(chatId);
    setIsSidebarOpen(false);
    setMessages([]);
    setIsLoadingChat(true); 

    try {
      const res = await fetch(`/api/lawbot/history/${chatId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      } else {
        console.error('Failed to load chat, status:', res.status);
      }
    } catch (error) {
      console.error('Failed to load messages', error);
    } finally {
      setIsLoadingChat(false); 
    }
  };

  const createNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setIsLoadingChat(false);
    setIsSidebarOpen(false);
  };

  const deleteChat = async (e, chatId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this chat?')) return;
    try {
      await fetch(`/api/lawbot/history/${chatId}`, { method: 'DELETE' });
      setChats(chats.filter((c) => c._id !== chatId));
      if (activeChatId === chatId) createNewChat();
    } catch (error) {
      console.error('Failed to delete chat', error);
    }
  };

  const renameChat = async (e, chatId, currentTitle) => {
    e.stopPropagation();
    const newTitle = window.prompt('Enter new chat name:', currentTitle);
    if (!newTitle || newTitle === currentTitle) return;
    try {
      const res = await fetch(`/api/lawbot/history/${chatId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        setChats(chats.map((c) => (c._id === chatId ? { ...c, title: newTitle } : c)));
      }
    } catch (error) {
      console.error('Failed to rename chat', error);
    }
  };

  const onSubmit = async (data) => {
    const userMsg = data.message;
    setMessages((prev) => [...prev, { text: userMsg, isUser: true }]);
    form.reset();
    setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          userInput: userMsg,
          mode: 'lawbot',
          chatId: activeChatId,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      setMessages((prev) => [...prev, { text: result.reply, isUser: false }]);

      if (!activeChatId && result.newChatId) {
        setActiveChatId(result.newChatId);
        fetchChats();
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "I'm having trouble connecting.", isUser: false },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handlePromptClick = (text) => {
    form.setValue('message', text, { shouldValidate: true });
    form.handleSubmit(onSubmit)();
  };

  const renderInputForm = (isCentered = false) => (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={`flex items-center gap-2 px-4 ${
        isCentered
          ? 'w-full max-w-2xl'
          : 'w-full bg-white dark:bg-[#020617] mt-auto p-4'
      }`}
    >
      <div className="rounded-3xl flex w-full items-center bg-slate-100 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 p-1 shadow-sm">
        <Input
          {...form.register('message')}
          className="focus-within:ring-0 text-lg focus-visible:ring-0 bg-transparent rounded-3xl p-5 border-none dark:text-slate-200"
          placeholder="Chat with Law Bot..."
          autoComplete="off"
        />
        <Button
          className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full text-white mr-1 h-10 w-10 p-0 flex items-center justify-center"
          disabled={isThinking || !form.formState.isValid}
          type="submit"
        >
          <ArrowUp size={20} />
        </Button>
      </div>
    </form>
  );
  const showWelcomeScreen = !activeChatId && messages.length === 0 && !isLoadingChat;
  const showChatArea = !isLoadingChat && (messages.length > 0 || activeChatId);

  if (!isLoaded)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-600" />
      </div>
    );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-[#020617] overflow-hidden">

      <div
        className={`fixed md:relative z-20 h-full w-72 bg-slate-50 dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          <Button
            onClick={createNewChat}
            className="flex-1 gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl"
          >
            <Plus size={18} /> New Chat
          </Button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden ml-2 p-2 text-slate-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
            Recent Chats
          </p>
          {chats.length === 0 ? (
            <p className="text-sm text-slate-500 px-2 italic">No previous chats</p>
          ) : (
            chats.map((c) => (
              <div
                key={c._id}
                onClick={() => loadChatMessages(c._id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                  activeChatId === c._id
                    ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400'
                    : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare size={16} className="shrink-0" />
                  <span className="text-sm font-medium truncate">{c.title}</span>
                </div>
                <div className="hidden group-hover:flex items-center gap-1 shrink-0 bg-slate-200 dark:bg-slate-800 pl-2 rounded-l-lg absolute right-3">
                  <button
                    onClick={(e) => renameChat(e, c._id, c.title)}
                    className="p-1 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => deleteChat(e, c._id)}
                    className="p-1 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col h-full relative w-full">

        <div className="md:hidden p-4 border-b border-slate-100 dark:border-slate-800 flex items-center bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md sticky top-0 z-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 font-bold text-slate-900 dark:text-white truncate">
            {activeChatId ? chats.find((c) => c._id === activeChatId)?.title : 'New Chat'}
          </span>
        </div>
        {isLoadingChat && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-pink-600 h-8 w-8" />
          </div>
        )}

        {showWelcomeScreen && (
          <div className="flex-1 w-full max-w-3xl mx-auto flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-gray-700 dark:text-white mb-8 text-center">
              {typingText}
            </h1>
            {renderInputForm(true)}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-3">
              {promptSuggestions.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handlePromptClick(prompt.text)}
                  className="flex items-center gap-2 border border-gray-300 dark:border-slate-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900 shadow-sm"
                >
                  {prompt.icon} {prompt.text}
                </button>
              ))}
            </div>
          </div>
        )}
        {showChatArea && (
          <div className="flex flex-col h-full items-center justify-between max-w-4xl w-full mx-auto">
            <div className="w-full overflow-y-auto custom-scrollbar flex-1 p-4 pb-2 space-y-6">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} user={user} />
              ))}
              {isThinking && (
                <div className="flex items-center space-x-4 animate-pulse">
                  <Skeleton className="h-11 w-11 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-4 w-[200px] bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              )}
            </div>
            {renderInputForm(false)}
          </div>
        )}

      </div>
    </div>
  );
}