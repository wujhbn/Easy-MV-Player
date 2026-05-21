import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Playlist } from '../types';

interface AppDB extends DBSchema {
  settings: {
    key: string;
    value: any;
  };
  playlists: {
    key: string;
    value: Playlist;
  };
}

let dbPromise: Promise<IDBPDatabase<AppDB>> | null = null;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<AppDB>('easy-mv-player', 1, {
      upgrade(db) {
        db.createObjectStore('settings');
        db.createObjectStore('playlists', { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
};

export const savePlaylistsToIDB = async (playlists: Playlist[]) => {
  const db = await initDB();
  const tx = db.transaction('playlists', 'readwrite');
  await tx.objectStore('playlists').clear();
  for (const playlist of playlists) {
    await tx.objectStore('playlists').put(playlist);
  }
  await tx.done;
};

export const loadPlaylistsFromIDB = async (): Promise<Playlist[]> => {
  const db = await initDB();
  return await db.getAll('playlists');
};

export const saveSettingsToIDB = async (key: string, value: any) => {
  const db = await initDB();
  await db.put('settings', value, key);
};

export const loadSettingsFromIDB = async (key: string, defaultValue: any) => {
  const db = await initDB();
  const value = await db.get('settings', key);
  return value !== undefined ? value : defaultValue;
};
