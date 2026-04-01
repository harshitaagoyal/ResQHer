'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import axios from 'axios';
import { useClerk } from '@clerk/nextjs';
import { Loader2, LocateIcon } from 'lucide-react';

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
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const contactMethods = ['Phone', 'Email', 'Text message', 'In-person'];

const FormSchema = z.object({
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  phone: z.string().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  occurrenceDuration: z.coerce.string().min(1, { message: 'Please specify a duration.' }),
  frequency: z.coerce.string().min(1, { message: 'Please specify a frequency.' }),
  visibleInjuries: z.enum(['Yes', 'No']).default('No'),
  preferredContact: z
    .array(z.string())
    .min(1, { message: 'Please select at least one contact method.' }),
  currentSituation: z.string().min(5, { message: 'Please describe the situation.' }),
  culprit: z.string().min(5, { message: 'Please describe the culprit.' }),
});

// 🚨 NEW: Smart AI Severity Calculator (Lives outside the main function)
const calculateSeverity = (duration, situation) => {
  const text = situation.toLowerCase();
  
  // High-risk keywords that indicate immediate physical danger
  const urgentWords = ['hit', 'beat', 'strike', 'weapon', 'gun', 'knife', 'blood', 'choke', 'kill', 'threat', 'injur', 'bleed', 'slap'];
  
  // Check if any high-risk words are in the user's situation summary
  const isUrgent = urgentWords.some(word => text.includes(word));
  
  if (isUrgent) return "Very High"; // Immediate physical danger
  if (parseInt(duration) >= 12) return "High"; // Long-term abuse (over a year)
  
  return "Medium"; // Default for emotional or shorter-term situations
};

export function InputForm({ setText, setTextGemma, setFormData }) {
  const { user } = useClerk();
  const [loading, setLoading] = useState(false);
  const [selectedContactMethods, setSelectedContactMethods] = useState([]);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user?.fullName || '',
      phone: '',
      location: { lat: 0, lng: 0 },
      occurrenceDuration: '1',
      frequency: '1',
      visibleInjuries: 'No',
      preferredContact: [],
      currentSituation: '',
      culprit: '',
    },
  });

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          form.setValue('location', { lat: latitude, lng: longitude });
        },
        (error) => console.error('Error fetching location:', error),
        { enableHighAccuracy: true }
      );
    }
  };

  async function onSubmit(data) {
    try {
      setLoading(true);
      
      // 🚨 Run the Smart Calculator
      const dynamicSeverity = calculateSeverity(data.occurrenceDuration, data.currentSituation);

      if (setFormData) {
        setFormData({
          ...data,
          severity: dynamicSeverity, // Automatically attach the calculated severity
          email: user?.primaryEmailAddress?.emailAddress || "" 
        });
      }

      const res = await axios.post('/api/generate-text', {
        ...data,
        email: user?.primaryEmailAddress?.emailAddress,
      });
      
      if (res.data.gemini_response && res.data.gemma_response) {
        setText(res.data.gemini_response);
        setTextGemma(res.data.gemma_response);
      }
    } catch (e) {
      console.error("Submission Error:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Preferred Contact Method</FormLabel>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {contactMethods.map((method) => (
                  <div key={method} className="flex items-center space-x-2 border dark:border-slate-800 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <Checkbox
                      checked={field.value.includes(method)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...field.value, method]
                          : field.value.filter((m) => m !== method);
                        field.onChange(newValue);
                        setSelectedContactMethods(newValue);
                      }}
                    />
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-200">
                      {method}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedContactMethods.includes('Phone') && (
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="animate-in slide-in-from-top-2 duration-300">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <FormLabel>Location Security</FormLabel>
          <div className="flex items-center gap-4 mt-2">
            <Input
              className="bg-white dark:bg-slate-950 dark:border-slate-800"
              value={form.watch('location.lat') !== 0 ? `Lat: ${form.watch('location.lat').toFixed(4)}, Lng: ${form.watch('location.lng').toFixed(4)}` : "No location set"}
              readOnly
            />
            <Button
              type="button"
              onClick={getUserLocation}
              variant="outline"
              className="shrink-0 gap-2 border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-900/50 dark:text-pink-400 dark:hover:bg-pink-950/30"
            >
              <LocateIcon className="h-4 w-4" />
              Detect
            </Button>
          </div>
        </div>

        <FormField
          control={form.control}
          name="occurrenceDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration of Incidents: <span className="text-pink-600 dark:text-pink-500 font-bold">{field.value} months</span></FormLabel>
              <FormControl>
                <Slider
                  value={[parseInt(field.value)]}
                  min={1}
                  max={120}
                  step={1}
                  onValueChange={(val) => field.onChange(val[0].toString())}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentSituation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Situation Summary</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us what is happening..." 
                  className="min-h-[100px] dark:bg-slate-950 dark:border-slate-800"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="culprit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Information about the Culprit</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Description of the person involved..." 
                  className="min-h-[100px] dark:bg-slate-950 dark:border-slate-800"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600 text-white h-12 text-lg font-bold transition-all"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating AI Summary...</>
          ) : (
            'Continue to AI Processing'
          )}
        </Button>
      </form>
    </Form>
  );
}