'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import axios from 'axios';
import { useClerk } from '@clerk/nextjs';
import { Loader2, CheckCircle2 } from 'lucide-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; 

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import InputFormLocationField from './InputFormLocationField';
import InputFormEvidenceField from './InputFormEvidenceField';

const contactMethods = ['Phone', 'Email', 'Text message', 'In-person'];

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
  phone: z.string().optional(),
  location: z.object({ lat: z.number(), lng: z.number() }),
  occurrenceDurationValue: z.number().min(1),
  occurrenceDurationUnit: z.enum(['days', 'months']),
  frequency: z.coerce.string().min(1, { message: 'Please specify a frequency.' }),
  visibleInjuries: z.enum(['Yes', 'No']).default('No'),
  preferredContact: z.array(z.string()).min(1, { message: 'Please select at least one contact method.' }),
  currentSituation: z.string().min(5, { message: 'Please describe the situation.' }),
  culprit: z.string().min(5, { message: 'Please describe the culprit.' }),
}).superRefine((data, ctx) => {
  const needsPhone = data.preferredContact.includes('Phone') || data.preferredContact.includes('Text message');
  if (needsPhone) {
    if (!data.phone) {
      ctx.addIssue({ path: ['phone'], message: 'Phone number is required.', code: z.ZodIssueCode.custom });
    } else if (!isValidPhoneNumber(data.phone)) {
      ctx.addIssue({ path: ['phone'], message: 'Invalid phone number.', code: z.ZodIssueCode.custom });
    }
  }
});

const calculateSeverity = (durationVal, unit, situation) => {
  const text = situation.toLowerCase();
  const urgentWords = ['hit', 'beat', 'strike', 'weapon', 'gun', 'knife', 'blood', 'choke', 'kill', 'threat', 'injur', 'bleed', 'slap'];
  const isUrgent = urgentWords.some(word => text.includes(word));
  if (isUrgent) return "Very High"; 
  const months = unit === 'months' ? durationVal : durationVal / 30;
  if (months >= 12) return "High"; 
  return "Medium"; 
};

export function InputForm() {
  const { user } = useClerk();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const [selectedContactMethods, setSelectedContactMethods] = useState([]);
  const [detectedCountry, setDetectedCountry] = useState('IN');
  const [attachments, setAttachments] = useState([]);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user?.fullName || '',
      phone: '',
      location: { lat: 0, lng: 0 },
      occurrenceDurationValue: 1,
      occurrenceDurationUnit: 'months',
      frequency: '1',
      visibleInjuries: 'No',
      preferredContact: [],
      currentSituation: '',
      culprit: '',
    },
  });

  async function onSubmit(data) {
    try {
      setLoading(true);
      const dynamicSeverity = calculateSeverity(data.occurrenceDurationValue, data.occurrenceDurationUnit, data.currentSituation);
      const combinedDurationStr = `${data.occurrenceDurationValue} ${data.occurrenceDurationUnit}`;
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', data.name);
      formDataToSubmit.append('email', user?.primaryEmailAddress?.emailAddress || '');
      formDataToSubmit.append('phone', data.phone || '');
      formDataToSubmit.append('locationLat', data.location.lat);
      formDataToSubmit.append('locationLng', data.location.lng);
      formDataToSubmit.append('occurrenceDuration', combinedDurationStr);
      formDataToSubmit.append('preferredContact', JSON.stringify(data.preferredContact));
      formDataToSubmit.append('currentSituation', data.currentSituation);
      formDataToSubmit.append('culprit', data.culprit);
      formDataToSubmit.append('severity', dynamicSeverity);
      formDataToSubmit.append('status', 'Pending');

      attachments.forEach((file) => {
        formDataToSubmit.append('attachments', file);
      });

      const response = await fetch('/api/submit-report', {
        method: 'POST',
        body: formDataToSubmit,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.details || "Unknown Server Error");
      }

      setIsSubmitted(true);

    } catch (e) {
      console.error("Submission Error:", e);
      alert(`Something went wrong securely submitting your report: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-12 animate-in fade-in zoom-in duration-500 p-4">
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 dark:text-green-500" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">Report Submitted Securely</h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
          Your information and evidence have been encrypted and sent to the admin team. They will reach out to you via your preferred contact method shortly.
        </p>
        <Button 
          onClick={() => window.location.href = '/'}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 font-bold"
        >
          Return to Home Safety
        </Button>
      </div>
    );
  }

  const showPhoneInput = selectedContactMethods.includes('Phone') || selectedContactMethods.includes('Text message');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input placeholder="Your name" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <InputFormLocationField form={form} setDetectedCountry={setDetectedCountry} />

        <FormField
          control={form.control}
          name="preferredContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Preferred Contact Method</FormLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
                {contactMethods.map((method) => (
                  <div key={method} className="flex items-center space-x-2 border dark:border-slate-800 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <Checkbox
                      checked={field.value.includes(method)}
                      onCheckedChange={(checked) => {
                        const newValue = checked ? [...field.value, method] : field.value.filter((m) => m !== method);
                        field.onChange(newValue);
                        setSelectedContactMethods(newValue);
                        if (!newValue.includes('Phone') && !newValue.includes('Text message')) {
                            form.setValue('phone', '');
                        }
                      }}
                    />
                    <label className="text-sm font-medium leading-none dark:text-slate-200">{method}</label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {showPhoneInput && (
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="animate-in slide-in-from-top-2 duration-300">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="flex w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-pink-500 [&_input]:bg-transparent [&_input]:outline-none">
                    <PhoneInput
                      placeholder="Enter phone number"
                      value={field.value}
                      onChange={field.onChange}
                      defaultCountry={detectedCountry} 
                      international
                      className="w-full dark:text-white"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="occurrenceDurationValue"
          render={({ field }) => {
            const unit = form.watch('occurrenceDurationUnit');
            const maxVal = unit === 'days' ? 30 : 120;
            return (
              <FormItem>
                <FormLabel>
                  Duration of Incidents: <span className="text-pink-600 dark:text-pink-500 font-bold ml-1">{field.value} {unit}</span>
                </FormLabel>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                  <FormControl className="flex-1 w-full pt-2 sm:pt-0">
                    <Slider value={[field.value]} min={1} max={maxVal} step={1} onValueChange={(val) => field.onChange(val[0])} />
                  </FormControl>
                  <select
                    className="w-full sm:w-32 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                    value={unit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      form.setValue('occurrenceDurationUnit', newUnit);
                      if (newUnit === 'days' && field.value > 30) form.setValue('occurrenceDurationValue', 30);
                    }}
                  >
                    <option value="days">Days</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="currentSituation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Situation Summary</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us what is happening..." className="min-h-[100px] dark:bg-slate-950 dark:border-slate-800" {...field} />
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
                <Textarea placeholder="Description of the person involved..." className="min-h-[100px] dark:bg-slate-950 dark:border-slate-800" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <InputFormEvidenceField attachments={attachments} setAttachments={setAttachments} />

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600 text-white h-12 text-lg font-bold transition-all mt-4 cursor-pointer"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Securely Submitting...</>
          ) : (
            'Submit Report Securely'
          )}
        </Button>
      </form>
    </Form>
  );
}