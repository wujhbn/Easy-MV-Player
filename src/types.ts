export interface Song {
  id: string; // YouTube ID
  title: string;
  url: string;
  thumbnail: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export interface AppState {
  playlists: Playlist[];
  currentPlaylistId: string | null;
  specialEdMode: boolean;
  voiceFeedback: boolean;
  // actions
  addPlaylist: (name: string) => void;
  renamePlaylist: (id: string, name: string) => void;
  deletePlaylist: (id: string) => void;
  reorderPlaylists: (fromIndex: number, toIndex: number) => void;
  setCurrentPlaylist: (id: string | null) => void;
  addSong: (playlistId: string, song: Song) => void;
  removeSong: (playlistId: string, songId: string) => void;
  reorderSongs: (playlistId: string, fromIndex: number, toIndex: number) => void;
  toggleSpecialEdMode: () => void;
  toggleVoiceFeedback: () => void;
  loadState: (state: Pick<AppState, "playlists" | "specialEdMode" | "voiceFeedback">) => void;
}
