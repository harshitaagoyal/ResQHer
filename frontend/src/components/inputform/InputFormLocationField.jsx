'use client';
import { LocateIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function InputFormLocationField({ form, setDetectedCountry }) {
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          form.setValue('location', { lat: latitude, lng: longitude });

          try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const data = await res.json();
            if (data && data.countryCode) {
              setDetectedCountry(data.countryCode); 
              form.setValue('phone', ''); 
            }
          } catch (err) {
            console.error("Could not auto-detect country code", err);
          }
        },
        (error) => console.error('Error fetching location:', error),
        { enableHighAccuracy: true }
      );
    }
  };

  const lat = form.watch('location.lat');
  const lng = form.watch('location.lng');
  const locationText = lat !== 0 ? `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}` : "No location set";

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
      <FormLabel>Location Security</FormLabel>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
        <Input
          className="bg-white dark:bg-slate-950 dark:border-slate-800 text-sm w-full"
          value={locationText}
          readOnly
        />
        <Button
          type="button"
          onClick={getUserLocation}
          variant="outline"
          className="w-full sm:w-auto shrink-0 gap-2 border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-900/50 dark:text-pink-400 dark:hover:bg-pink-950/30 font-semibold transition-colors cursor-pointer"
        >
          <LocateIcon className="h-4 w-4" />
          Detect
        </Button>
      </div>
    </div>
  );
}