import { create } from 'zustand';
import type { Artist } from '@/types';

interface ArtistModalState {
  selectedArtist: Artist | null;
  isOpen: boolean;
  openArtist: (artist: Artist) => void;
  closeArtist: () => void;
}

export const useArtistModalStore = create<ArtistModalState>((set) => ({
  selectedArtist: null,
  isOpen: false,
  openArtist: (artist) => set({ selectedArtist: artist, isOpen: true }),
  closeArtist: () => set({ isOpen: false, selectedArtist: null }),
}));
