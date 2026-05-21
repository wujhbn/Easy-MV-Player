import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ScreenState } from '@/App';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Settings, PlayCircle, Trash2, Edit2 } from 'lucide-react';
import { speak } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onNavigate: (state: ScreenState) => void;
}

export function PlaylistsScreen({ onNavigate }: Props) {
  const { playlists, addPlaylist, deletePlaylist, specialEdMode, voiceFeedback } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handlePlaylistClick = (id: string, name: string) => {
    speak(`Opening ${name}`, voiceFeedback);
    onNavigate({ name: 'PLAYLIST_DETAIL', playlistId: id });
  };

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      addPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsAdding(false);
      speak(`Created playlist ${newPlaylistName}`, voiceFeedback);
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-4 sm:p-8 bg-brand-pink relative">
      <header className="flex justify-between items-center mb-8 shrink-0">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-brown tracking-tight flex items-center gap-4">
          <PlayCircle size={48} className="text-brand-yellow drop-shadow-[2px_2px_0_theme(colors.brand.brown)]" />
          Easy MV Player
        </h1>
        
        {!specialEdMode && (
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => setIsAdding(true)}>
              <Plus size={32} />
            </Button>
            <Button variant="primary" onClick={() => onNavigate({ name: 'SETTINGS' })}>
              <Settings size={32} />
            </Button>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-6">
             <div className="text-8xl">🎵</div>
             <p className="text-3xl font-bold text-brand-brown">No playlists yet!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 scroll-smooth">
            <AnimatePresence>
              {playlists.map((pl) => (
                <motion.div
                  key={pl.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-[2rem] border-[6px] border-brand-brown shadow-cute overflow-hidden flex flex-col h-48 relative group"
                >
                  <button 
                    onClick={() => handlePlaylistClick(pl.id, pl.name)}
                    className="flex-1 p-6 text-left flex flex-col justify-end active:bg-brand-pink/20 transition-colors w-full h-full"
                  >
                    <h2 className="text-3xl font-bold line-clamp-2 leading-tight">{pl.name}</h2>
                    <p className="text-xl opacity-70 mt-2 font-semibold">{pl.songs.length} songs</p>
                  </button>

                  {!specialEdMode && (
                    <div className="absolute top-4 right-4 bg-white/90 rounded-xl flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="danger" className="h-14 min-w-14 px-0 w-14 rounded-xl border-[3px]" onClick={(e) => {
                          e.stopPropagation();
                          deletePlaylist(pl.id);
                      }}>
                        <Trash2 size={24} />
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
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
              className="bg-brand-pink border-8 border-brand-brown rounded-[2.5rem] shadow-[8px_8px_0_theme(colors.amber.900)] p-8 max-w-xl w-full flex flex-col gap-6"
            >
              <h2 className="text-3xl font-black">New Playlist</h2>
              <Input 
                autoFocus
                placeholder="E.g. Cartoon Songs"
                value={newPlaylistName}
                onChange={e => setNewPlaylistName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
              />
              <div className="flex gap-4 justify-end mt-4">
                <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button variant="secondary" onClick={handleCreate}>Save</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
