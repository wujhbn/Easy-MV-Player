import React, { useState } from 'react';
import { ScreenState } from '@/App';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { fetchYouTubeVideoInfo, speak } from '@/lib/utils';
import { ArrowLeft, Play, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  playlistId: string;
  onNavigate: (state: ScreenState) => void;
}

export function PlaylistDetailScreen({ playlistId, onNavigate }: Props) {
  const { playlists, specialEdMode, voiceFeedback, addSong, removeSong } = useAppStore();
  const playlist = playlists.find(p => p.id === playlistId);
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-3xl font-bold bg-brand-pink">
        Playlist not found
        <Button onClick={() => onNavigate({ name: 'HOME' })} className="mt-8">Go Back</Button>
      </div>
    );
  }

  const handleAddUrl = async () => {
    if (!urlInput.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const info = await fetchYouTubeVideoInfo(urlInput.trim());
      addSong(playlistId, info);
      speak(`Added ${info.title}`, voiceFeedback);
      setUrlInput('');
      setIsAddingUrl(false);
    } catch (e: any) {
      setErrorMsg(e.message || "Could not add video. Check the link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaySong = (index: number, title: string) => {
    speak(`Playing ${title}`, voiceFeedback);
    onNavigate({ name: 'PLAYER', playlistId: playlistId, initialSongIndex: index });
  };

  return (
    <div className="flex flex-col h-full w-full p-4 sm:p-8 bg-brand-pink relative">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => onNavigate({ name: 'HOME' })} className="px-4">
            <ArrowLeft size={40} />
          </Button>
          <h1 className="text-4xl sm:text-5xl font-extrabold line-clamp-1">{playlist.name}</h1>
        </div>
        
        <div className="flex gap-4">
           {playlist.songs.length > 0 && (
             <Button variant="control" onClick={() => handlePlaySong(0, playlist.songs[0].title)}>
               <Play size={32} className="mr-2" fill="currentColor" /> Play First
             </Button>
           )}
           {!specialEdMode && (
             <Button variant="secondary" onClick={() => setIsAddingUrl(true)}>
               <Plus size={32} /> Add
             </Button>
           )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {playlist.songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-6">
             <div className="text-8xl">🎧</div>
             <p className="text-3xl font-bold">No songs yet!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
            <AnimatePresence>
              {playlist.songs.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[2rem] border-4 sm:border-[6px] border-brand-brown shadow-cute overflow-hidden flex items-center relative group"
                >
                  <button 
                    className="flex flex-1 items-center gap-4 sm:gap-6 p-4 sm:p-6 active:bg-brand-pink-dark/50 transition-colors text-left"
                    onClick={() => handlePlaySong(index, song.title)}
                  >
                    <div className="relative w-32 h-24 sm:w-48 sm:h-32 shrink-0 rounded-xl overflow-hidden border-4 border-brand-brown bg-gray-200">
                       <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                           <Play size={40} className="text-white drop-shadow-md" fill="white" />
                       </div>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold leading-tight line-clamp-3">{song.title}</h3>
                  </button>
                  
                  {!specialEdMode && (
                    <div className="p-4 sm:p-6 pl-0 shrink-0">
                      <Button variant="danger" className="h-[80px] w-[80px] sm:h-20 sm:w-20 px-0 rounded-2xl border-[4px]" onClick={() => removeSong(playlistId, song.id)}>
                        <Trash2 size={32} />
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Add Song Modal */}
      <AnimatePresence>
        {isAddingUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-brown/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.9 }}
              className="bg-brand-pink border-8 border-brand-brown rounded-[2.5rem] shadow-[8px_8px_0_theme(colors.amber.900)] p-6 sm:p-8 max-w-2xl w-full flex flex-col gap-6"
            >
              <h2 className="text-3xl sm:text-4xl font-black">Add YouTube Video</h2>
              <p className="text-xl font-bold opacity-80">Paste a YouTube link below</p>
              
              <Input 
                autoFocus
                placeholder="https://youtube.com/watch?v=..."
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddUrl()}
              />
              
              {errorMsg && <p className="text-red-500 font-bold text-xl">{errorMsg}</p>}
              
              <div className="flex gap-4 justify-end mt-4">
                <Button variant="ghost" onClick={() => setIsAddingUrl(false)} disabled={isLoading}>Cancel</Button>
                <Button variant="secondary" onClick={handleAddUrl} disabled={isLoading || !urlInput.trim()}>
                  {isLoading ? "Loading..." : "Get Video"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
