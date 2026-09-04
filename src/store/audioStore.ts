import { create } from 'zustand';
import type { Track, RepeatMode, LyricLine, TrackDirection } from '@/types';
import { mockTracks, mockLyrics } from '@/lib/mockData';
import { getStreamUrl, getLyrics } from '@/lib/api';
import { extractDominantColor, type RGB } from '@/lib/color';

interface AudioState {
  queue: Track[];
  currentIndex: number;
  currentTrack: Track | null;

  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;

  shuffle: boolean;
  repeat: RepeatMode;

  isFullscreenOpen: boolean;
  showLyrics: boolean;

  lyrics: LyricLine[];
  lyricsLoading: boolean;

  dominantColor: RGB;
  prevDominantColor: RGB;

  trackDirection: TrackDirection;
  likedTrackIds: Set<string>;

  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (d: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setFullscreenOpen: (open: boolean) => void;
  toggleLyrics: () => void;
  setLyrics: (lyrics: LyricLine[]) => void;
  loadLyrics: (track: Track) => Promise<void>;
  updateDominantColor: (cover: string) => Promise<void>;
  toggleLike: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
}

let audio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio();
    audio.volume = 0.7;
  }
  return audio;
}

function ensureStreamAndPlay(track: Track) {
  const el = getAudio();
  const url = track.streamUrl;
  if (url) {
    el.src = url;
    el.play().catch(() => {});
  } else if (track.videoId) {
    getStreamUrl(track.videoId).then((streamUrl) => {
      if (streamUrl) {
        el.src = streamUrl;
        el.play().catch(() => {});
      } else if (track.streamUrl) {
        el.src = track.streamUrl;
        el.play().catch(() => {});
      }
    });
  }
}

export const useAudioStore = create<AudioState>((set, get) => ({
  queue: mockTracks,
  currentIndex: 0,
  currentTrack: null,

  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  muted: false,

  shuffle: false,
  repeat: 'off',

  isFullscreenOpen: false,
  showLyrics: false,

  lyrics: mockLyrics,
  lyricsLoading: false,

  dominantColor: { r: 30, g: 30, b: 40 },
  prevDominantColor: { r: 30, g: 30, b: 40 },

  trackDirection: 'none',
  likedTrackIds: new Set(),

  playTrack: (track, queue) => {
    const q = queue || [track];
    const idx = q.findIndex((t) => t.id === track.id);
    const index = idx >= 0 ? idx : 0;
    const currentIdx = get().currentIndex;
    const direction = q === get().queue && index > currentIdx ? 'next' : index < currentIdx ? 'prev' : 'none';

    set((s) => ({
      prevDominantColor: s.dominantColor,
      currentTrack: track,
      currentIndex: index,
      queue: q,
      isPlaying: true,
      currentTime: 0,
      showLyrics: false,
      lyrics: mockLyrics,
      trackDirection: direction,
    }));
    ensureStreamAndPlay(track);
    get().loadLyrics(track);
    if (track.cover) get().updateDominantColor(track.cover);
  },

  togglePlay: () => {
    const el = getAudio();
    const { isPlaying, currentTrack } = get();
    if (!currentTrack) {
      const first = get().queue[0];
      if (first) get().playTrack(first);
      return;
    }
    if (isPlaying) {
      el.pause();
      set({ isPlaying: false });
    } else {
      el.play().catch(() => {});
      set({ isPlaying: true });
    }
  },

  next: () => {
    const { queue, currentIndex, shuffle, repeat } = get();
    if (repeat === 'one') {
      const el = getAudio();
      el.currentTime = 0;
      el.play().catch(() => {});
      return;
    }
    let nextIdx: number;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = currentIndex + 1;
      if (nextIdx >= queue.length) {
        if (repeat === 'all') nextIdx = 0;
        else return;
      }
    }
    const track = queue[nextIdx];
    if (track) {
      set((s) => ({
        prevDominantColor: s.dominantColor,
        currentIndex: nextIdx,
        currentTrack: track,
        currentTime: 0,
        isPlaying: true,
        trackDirection: 'next',
        lyrics: mockLyrics,
      }));
      ensureStreamAndPlay(track);
      get().loadLyrics(track);
      if (track.cover) get().updateDominantColor(track.cover);
    }
  },

  prev: () => {
    const { queue, currentIndex } = get();
    const el = getAudio();
    if (el.currentTime > 3) {
      el.currentTime = 0;
      return;
    }
    let prevIdx = currentIndex - 1;
    if (prevIdx < 0) prevIdx = queue.length - 1;
    const track = queue[prevIdx];
    if (track) {
      set((s) => ({
        prevDominantColor: s.dominantColor,
        currentIndex: prevIdx,
        currentTrack: track,
        currentTime: 0,
        isPlaying: true,
        trackDirection: 'prev',
        lyrics: mockLyrics,
      }));
      ensureStreamAndPlay(track);
      get().loadLyrics(track);
      if (track.cover) get().updateDominantColor(track.cover);
    }
  },

  seek: (time) => {
    const el = getAudio();
    el.currentTime = time;
    set({ currentTime: time });
  },

  setVolume: (vol) => {
    const el = getAudio();
    el.volume = vol;
    el.muted = vol === 0;
    set({ volume: vol, muted: vol === 0 });
  },

  toggleMute: () => {
    const el = getAudio();
    el.muted = !el.muted;
    set({ muted: el.muted });
  },

  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),

  toggleRepeat: () =>
    set((s) => ({
      repeat: s.repeat === 'off' ? 'all' : s.repeat === 'all' ? 'one' : 'off',
    })),

  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (d) => set({ duration: d }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setFullscreenOpen: (open) => set({ isFullscreenOpen: open }),
  toggleLyrics: () => set((s) => ({ showLyrics: !s.showLyrics })),
  setLyrics: (lyrics) => set({ lyrics }),

  loadLyrics: async (track) => {
    set({ lyricsLoading: true });
    const lyrics = await getLyrics(track.artist, track.title);
    set({ lyrics: lyrics || mockLyrics, lyricsLoading: false });
  },

  updateDominantColor: async (cover) => {
    const color = await extractDominantColor(cover);
    set((s) => ({ prevDominantColor: s.dominantColor, dominantColor: color }));
  },

  toggleLike: (trackId) =>
    set((s) => {
      const liked = new Set(s.likedTrackIds);
      if (liked.has(trackId)) liked.delete(trackId);
      else liked.add(trackId);
      return { likedTrackIds: liked };
    }),

  isLiked: (trackId) => get().likedTrackIds.has(trackId),
}));

export function initAudioEvents() {
  const el = getAudio();
  const store = useAudioStore;

  el.addEventListener('timeupdate', () => {
    store.getState().setCurrentTime(el.currentTime);
  });
  el.addEventListener('loadedmetadata', () => {
    store.getState().setDuration(el.duration || 0);
  });
  el.addEventListener('ended', () => {
    store.getState().next();
  });
  el.addEventListener('play', () => store.getState().setIsPlaying(true));
  el.addEventListener('pause', () => store.getState().setIsPlaying(false));
}
