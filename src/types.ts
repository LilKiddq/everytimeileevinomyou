export interface Artist {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  monthlyListeners: number;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  artists: Artist[];
  album: string;
  cover: string;
  duration: number; // seconds
  videoId?: string;
  streamUrl?: string;
  genre?: string;
}

export interface LyricLine {
  time: number; // seconds
  text: string;
}

export interface Playlist {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  tracks: Track[];
}

export type FilterType = 'all' | 'tracks' | 'artists' | 'albums';

export type RepeatMode = 'off' | 'all' | 'one';

export type TrackDirection = 'next' | 'prev' | 'none';
