import { create } from 'zustand';
import { AppState, Playlist, Song } from '../types';
import { savePlaylistsToIDB, saveSettingsToIDB } from '../lib/idb';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useAppStore = create<AppState>((set, get) => ({
  playlists: [],
  currentPlaylistId: null,
  specialEdMode: false,
  voiceFeedback: true,

  loadState: (state) => {
    set({
      playlists: state.playlists || [],
      specialEdMode: state.specialEdMode ?? false,
      voiceFeedback: state.voiceFeedback ?? true
    });
  },

  addPlaylist: (name) => {
    const newPlaylist: Playlist = { id: generateId(), name, songs: [] };
    const newPlaylists = [...get().playlists, newPlaylist];
    set({ playlists: newPlaylists });
    savePlaylistsToIDB(newPlaylists);
  },

  renamePlaylist: (id, name) => {
    const newPlaylists = get().playlists.map(p => p.id === id ? { ...p, name } : p);
    set({ playlists: newPlaylists });
    savePlaylistsToIDB(newPlaylists);
  },

  deletePlaylist: (id) => {
    const newPlaylists = get().playlists.filter(p => p.id !== id);
    set({
      playlists: newPlaylists,
      currentPlaylistId: get().currentPlaylistId === id ? null : get().currentPlaylistId
    });
    savePlaylistsToIDB(newPlaylists);
  },

  reorderPlaylists: (fromIndex, toIndex) => {
    const newPlaylists = [...get().playlists];
    const [moved] = newPlaylists.splice(fromIndex, 1);
    newPlaylists.splice(toIndex, 0, moved);
    set({ playlists: newPlaylists });
    savePlaylistsToIDB(newPlaylists);
  },

  setCurrentPlaylist: (id) => {
    set({ currentPlaylistId: id });
  },

  addSong: (playlistId, song) => {
    const newPlaylists = get().playlists.map(p => {
      if (p.id === playlistId) {
        // Prevent duplicate songs in same playlist
        if (!p.songs.some(s => s.id === song.id)) {
           return { ...p, songs: [...p.songs, song] };
        }
      }
      return p;
    });
    set({ playlists: newPlaylists });
    savePlaylistsToIDB(newPlaylists);
  },

  removeSong: (playlistId, songId) => {
    const newPlaylists = get().playlists.map(p => {
      if (p.id === playlistId) {
        return { ...p, songs: p.songs.filter(s => s.id !== songId) };
      }
      return p;
    });
    set({ playlists: newPlaylists });
    savePlaylistsToIDB(newPlaylists);
  },

  reorderSongs: (playlistId, fromIndex, toIndex) => {
    const newPlaylists = get().playlists.map(p => {
      if (p.id === playlistId) {
        const newSongs = [...p.songs];
        const [moved] = newSongs.splice(fromIndex, 1);
        newSongs.splice(toIndex, 0, moved);
        return { ...p, songs: newSongs };
      }
      return p;
    });
    set({ playlists: newPlaylists });
    savePlaylistsToIDB(newPlaylists);
  },

  toggleSpecialEdMode: () => {
    const newValue = !get().specialEdMode;
    set({ specialEdMode: newValue });
    saveSettingsToIDB('specialEdMode', newValue);
  },

  toggleVoiceFeedback: () => {
    const newValue = !get().voiceFeedback;
    set({ voiceFeedback: newValue });
    saveSettingsToIDB('voiceFeedback', newValue);
  }
}));
