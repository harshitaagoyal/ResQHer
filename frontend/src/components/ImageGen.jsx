'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { SparklesIcon, ImageIcon, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

const FormSchema = z.object({
  generatedText: z.string(),
  imagePrompt: z.string().min(3, { message: 'Please specify the image prompt.' }),
});

export default function ImageGen({ text, textGemma, setResImage }) {
  const [imageOptions, setImageOptions] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      generatedText: text || '',
      imagePrompt: '',
    },
  });

  const promptSuggestions = [
    'Good Morning',
    'Good Night', 
    'Sunset',
    'Mountains',
    'Ocean',
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post('/api/generate-image', data);
      setImageOptions(res.data.images);
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    form.setValue('imagePrompt', suggestion);
  };

  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
    setResImage(imageUrl);
  };

  const handleTextOptionClick = (option, model) => {
    setSelectedText(option);
    setSelectedModel(model);
    form.setValue('generatedText', option);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          {/* Step 1: AI Summary Selection */}
          <FormField
            control={form.control}
            name="generatedText"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-bold dark:text-slate-100">Step 1: Choose your AI Summary</FormLabel>
                <FormControl>
                  {!selectedText ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {[
                        { content: text, model: 'Gemini' },
                        { content: textGemma, model: 'Gemma' }
                      ].map((option, index) => (
                        <div
                          key={index}
                          onClick={() => handleTextOptionClick(option.content, option.model)}
                          className={`cursor-pointer group relative p-6 rounded-xl border-2 transition-all hover:shadow-md ${
                            option.model === 'Gemini'
                              ? 'border-blue-100 bg-blue-50/30 hover:border-blue-400 dark:border-blue-900/30 dark:bg-blue-900/10 dark:hover:border-blue-500/50'
                              : 'border-orange-100 bg-orange-50/30 hover:border-orange-400 dark:border-orange-900/30 dark:bg-orange-900/10 dark:hover:border-orange-500/50'
                          }`}
                        >
                          <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-4 line-clamp-[10]">
                            {option.content}
                          </p>
                          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${
                            option.model === 'Gemini' ? 'bg-blue-500' : 'bg-orange-500'
                          }`}>
                            {option.model}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="relative">
                      <Textarea
                        {...field}
                        value={selectedText}
                        rows={8}
                        className="bg-slate-50 dark:bg-slate-900/50 border-pink-200 dark:border-pink-900/30 dark:text-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedText('')}
                        className="absolute top-2 right-2 text-xs text-pink-600 dark:text-pink-400 hover:underline"
                      >
                        Change Model
                      </button>
                    </div>
                  )}
                </FormControl>
                {selectedText && (
                  <div className="flex items-center gap-2 font-medium text-pink-700 dark:text-pink-400 float-right text-sm py-2">
                    <SparklesIcon size={16} />
                    <span>Using {selectedModel} Summary</span>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Step 2: Image Prompt */}
          <FormField
            control={form.control}
            name="imagePrompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-bold dark:text-slate-100">Step 2: Generate Supportive Imagery</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <Input
                      placeholder="e.g. A safe harbor, a strong community..."
                      className="border-pink-200 dark:border-pink-900/30 dark:bg-slate-900/50 dark:text-slate-200 focus-visible:ring-pink-500"
                      {...field}
                    />
                    <div className="flex flex-wrap gap-2">
                      {promptSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 px-3 py-1.5 rounded-full border border-pink-100 dark:border-pink-900/30 hover:bg-pink-100 dark:hover:bg-pink-900/40 transition"
                        >
                          + {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600 text-white h-12 text-lg transition-all active:scale-[0.98]"
          >
            {isLoading ? 'Painting your vision...' : 'Generate AI Visuals'}
          </Button>
        </form>
      </Form>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {/* Image results */}
      {!isLoading && imageOptions && (
        <div className="mt-8 space-y-4 animate-in fade-in duration-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
            <ImageIcon className="text-pink-600 dark:text-pink-500" /> Pick an image for your report
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {imageOptions.map((imageUrl, index) => (
              <div
                key={index}
                className={`group relative cursor-pointer aspect-square rounded-xl overflow-hidden border-4 transition-all ${
                  selectedImage === imageUrl
                    ? 'border-pink-500 ring-4 ring-pink-100 dark:ring-pink-900/20'
                    : 'border-transparent hover:border-pink-200 dark:hover:border-pink-900/40'
                }`}
                onClick={() => handleImageSelect(imageUrl)}
              >
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <img
                  src={imageUrl}
                  alt={`AI Visual ${index + 1}`}
                  className="relative z-10 object-cover w-full h-full transition-transform group-hover:scale-110"
                />
                {selectedImage === imageUrl && (
                  <div className="absolute inset-0 z-20 bg-pink-600/20 flex items-center justify-center">
                    <CheckCircle2 className="text-white w-12 h-12 drop-shadow-lg" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}