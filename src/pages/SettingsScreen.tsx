import React from 'react';
import { ScreenState } from '@/App';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onNavigate: (state: ScreenState) => void;
}

export function SettingsScreen({ onNavigate }: Props) {
  const { specialEdMode, toggleSpecialEdMode, voiceFeedback, toggleVoiceFeedback } = useAppStore();

  return (
    <div className="flex flex-col h-full w-full p-4 sm:p-8 bg-brand-pink relative overflow-y-auto">
      <header className="flex items-center gap-4 mb-12 shrink-0">
        <Button variant="ghost" onClick={() => onNavigate({ name: 'HOME' })} className="px-4">
          <ArrowLeft size={40} />
        </Button>
        <h1 className="text-4xl sm:text-5xl font-extrabold pb-2">Settings</h1>
      </header>

      <main className="max-w-2xl w-full mx-auto flex flex-col gap-8 pb-24">
         
         <div className="bg-white rounded-[2rem] border-[6px] border-brand-brown shadow-cute p-8">
            <h2 className="text-3xl font-bold mb-4">Special Education Mode</h2>
            <p className="text-xl opacity-80 mb-8 font-semibold">
               When enabled, advanced features like adding/deleting playlists or songs, and complex player controls are hidden. Best for independent student use.
            </p>
            <Button 
                variant={specialEdMode ? "control" : "secondary"} 
                size="xl" 
                className="w-full flex justify-between"
                onClick={toggleSpecialEdMode}
            >
               <span>{specialEdMode ? "Enabled" : "Disabled"}</span>
               {specialEdMode && <Check size={40} />}
            </Button>
         </div>

         <div className="bg-white rounded-[2rem] border-[6px] border-brand-brown shadow-cute p-8">
            <h2 className="text-3xl font-bold mb-4">Voice Feedback</h2>
            <p className="text-xl opacity-80 mb-8 font-semibold">
               The app will speak simple phrases when buttons are pressed (e.g. "Next song", "Playing").
            </p>
            <Button 
                variant={voiceFeedback ? "control" : "secondary"} 
                size="xl" 
                className="w-full flex justify-between"
                onClick={toggleVoiceFeedback}
            >
               <span>{voiceFeedback ? "Enabled" : "Disabled"}</span>
               {voiceFeedback && <Check size={40} />}
            </Button>
         </div>

      </main>
    </div>
  );
}
