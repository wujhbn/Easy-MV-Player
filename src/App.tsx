import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { PlaylistsScreen } from '@/pages/PlaylistsScreen';
import { PlaylistDetailScreen } from '@/pages/PlaylistDetailScreen';
import { PlayerScreen } from '@/pages/PlayerScreen';
import { SettingsScreen } from '@/pages/SettingsScreen';

export type ScreenState = 
  | { name: 'HOME' }
  | { name: 'PLAYLIST_DETAIL'; playlistId: string }
  | { name: 'PLAYER'; playlistId: string; initialSongIndex: number }
  | { name: 'SETTINGS' };

export default function App() {
  const [screen, setScreen] = useState<ScreenState>({ name: 'HOME' });
  const loadState = useAppStore(s => s.loadState);
  
  React.useEffect(() => {
    // Load from IDB on mount
    import('@/lib/idb').then(async ({ loadPlaylistsFromIDB, loadSettingsFromIDB }) => {
      const playlists = await loadPlaylistsFromIDB();
      const specialEdMode = await loadSettingsFromIDB('specialEdMode', false);
      const voiceFeedback = await loadSettingsFromIDB('voiceFeedback', true);
      loadState({ playlists, specialEdMode, voiceFeedback });
    });
  }, [loadState]);

  return (
    <div className="w-full h-full text-brand-brown">
      {screen.name === 'HOME' && <PlaylistsScreen onNavigate={setScreen} />}
      {screen.name === 'PLAYLIST_DETAIL' && <PlaylistDetailScreen playlistId={screen.playlistId} onNavigate={setScreen} />}
      {screen.name === 'PLAYER' && <PlayerScreen playlistId={screen.playlistId} initialSongIndex={screen.initialSongIndex} onNavigate={setScreen} />}
      {screen.name === 'SETTINGS' && <SettingsScreen onNavigate={setScreen} />}
    </div>
  );
}
