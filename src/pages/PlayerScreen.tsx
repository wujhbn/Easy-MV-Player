import React, { useState, useRef, useEffect } from 'react';
import { ScreenState } from '@/App';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { speak } from '@/lib/utils';
import { SkipBack, SkipForward, Pause, Play, Home, ArrowLeft, Maximize } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  playlistId: string;
  initialSongIndex: number;
  onNavigate: (state: ScreenState) => void;
}

export function PlayerScreen({ playlistId, initialSongIndex, onNavigate }: Props) {
  const { playlists, voiceFeedback, specialEdMode } = useAppStore();
  const playlist = playlists.find(p => p.id === playlistId);
  const [currentIndex, setCurrentIndex] = useState(initialSongIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const playerRef = useRef<YouTubePlayer | null>(null);

  if (!playlist || playlist.songs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-brand-pink">
        <Button onClick={() => onNavigate({ name: 'HOME' })}>Go Home</Button>
      </div>
    );
  }

  const currentSong = playlist.songs[currentIndex];

  const handleNext = () => {
    if (currentIndex < playlist.songs.length - 1) {
      setCurrentIndex(c => c + 1);
      speak("Next song", voiceFeedback);
    } else {
      speak("Playlist finished", voiceFeedback);
      onNavigate({ name: 'PLAYLIST_DETAIL', playlistId });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(c => c - 1);
      speak("Previous song", voiceFeedback);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
      speak("Paused", voiceFeedback);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
      speak("Playing", voiceFeedback);
    }
  };

  const handleFullscreen = () => {
    const iframe = playerRef.current?.getIframe();
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    event.target.playVideo();
    setIsPlaying(true);
  };

  const onStateChange = (event: YouTubeEvent) => {
    // 1 = playing, 2 = paused, 0 = ended
    if (event.data === 1) setIsPlaying(true);
    if (event.data === 2) setIsPlaying(false);
    if (event.data === 0) handleNext();
  };

  return (
    <div className="flex flex-col h-full w-full bg-brand-brown text-white relative">
      {/* Top Header */}
      <header className="flex-shrink-0 p-4 flex items-center justify-between z-10 sticky top-0 bg-brand-brown">
        <div className="flex gap-4">
          <Button variant="ghost" className="text-white border-white hover:bg-white/20" size="xl" onClick={() => onNavigate({ name: 'HOME' })}>
            <Home size={40} />
          </Button>
          {!specialEdMode && (
             <Button variant="ghost" className="text-white border-white hover:bg-white/20 hidden sm:flex" size="xl" onClick={() => onNavigate({ name: 'PLAYLIST_DETAIL', playlistId })}>
               <ArrowLeft size={40} />
             </Button>
          )}
        </div>
        
        <h2 className="text-2xl sm:text-4xl font-bold truncate px-4 flex-1 text-center">
          {currentSong.title}
        </h2>
        
        {!specialEdMode && (
          <Button variant="ghost" className="text-white border-white hover:bg-white/20" size="xl" onClick={handleFullscreen}>
            <Maximize size={40} />
          </Button>
        )}
      </header>

      {/* Video Area */}
      <div className="flex-1 flex items-center justify-center max-w-[1200px] w-full mx-auto relative px-4 pb-4">
        <div className="w-full aspect-video rounded-3xl overflow-hidden border-8 border-brand-pink shadow-[8px_8px_0_theme(colors.pink.200)] bg-black pointer-events-auto sm:pointer-events-auto">
           {/* Note: iframe uses standard mouse/touch events. We wrap it nicely. */}
           <YouTube
             videoId={currentSong.id}
             opts={{
               width: '100%',
               height: '100%',
               playerVars: {
                 autoplay: 1,
                 controls: specialEdMode ? 0 : 1, // hide native controls in special ed mode
                 rel: 0,
                 modestbranding: 1,
                 disablekb: specialEdMode ? 1 : 0,
                 fs: 0, // disable native fullscreen button if special ed mode? Let's hide it to keep it simple and use our own
               },
             }}
             className="w-full h-full"
             onReady={onReady}
             onStateChange={onStateChange}
             onEnd={handleNext}
           />
        </div>
      </div>

      {/* Super Simple Big Controls Area */}
      <div className="flex-shrink-0 bg-brand-pink border-t-8 border-amber-900 p-6 pb-10 sm:p-10 flex items-center justify-center gap-6 sm:gap-12 rounded-t-[3rem]">
         {!specialEdMode && (
           <Button variant="secondary" size="xl" disabled={currentIndex === 0} onClick={handlePrev} className="h-28 min-w-28 sm:h-32 sm:min-w-32 rounded-[2rem]">
             <SkipBack size={64} fill="currentColor" />
           </Button>
         )}

         <Button variant="primary" size="xl" onClick={togglePlay} className="h-32 min-w-32 sm:h-40 sm:min-w-40 rounded-[2.5rem]">
            {isPlaying ? <Pause size={80} fill="currentColor" /> : <Play size={80} fill="currentColor" className="ml-4" />}
         </Button>

         <Button variant="control" size="xl" onClick={handleNext} className="h-28 min-w-28 sm:h-32 sm:min-w-32 rounded-[2rem]">
            <SkipForward size={64} fill="currentColor" />
         </Button>
      </div>
    </div>
  );
}
