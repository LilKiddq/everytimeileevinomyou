import type { Track, Playlist, LyricLine, Artist } from '@/types';

const MOCK_AUDIO =
  'https://archive.org/download/MLKDream/MLKDream_64kb.mp3';

export const mockArtists: Artist[] = [
  {
    id: 'ar-1',
    name: 'Neon Cascade',
    avatar:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop',
    bio: 'Electronic duo crafting immersive soundscapes from their Berlin studio. Known for blending analog synths with field recordings.',
    monthlyListeners: 1842000,
  },
  {
    id: 'ar-2',
    name: 'Lunar Drift',
    avatar:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    bio: 'Ambient project from Reykjavik. Their music evokes vast Arctic landscapes and deep-space solitude.',
    monthlyListeners: 976000,
  },
  {
    id: 'ar-3',
    name: 'Aurora Vale',
    avatar:
      'https://images.unsplash.com/photo-1518972559570-7cc1309f3119?w=200&h=200&fit=crop',
    bio: 'Classically trained pianist turned electronic producer. Aurora Vale bridges the gap between orchestral and electronic.',
    monthlyListeners: 2340000,
  },
  {
    id: 'ar-4',
    name: 'Cosmic Tide',
    avatar:
      'https://images.unsplash.com/photo-1470225620780-dba6ba1d4acc?w=200&h=200&fit=crop',
    bio: 'Psychedelic electronic collective from Portland. Their live shows are legendary for their immersive visual productions.',
    monthlyListeners: 1289000,
  },
  {
    id: 'ar-5',
    name: 'Echo Chamber',
    avatar:
      'https://images.unsplash.com/photo-1614624532983-4e1f8f1b8a1f?w=200&h=200&fit=crop',
    bio: 'Experimental bass producer from London. Pushing the boundaries of low-frequency sound design.',
    monthlyListeners: 743000,
  },
  {
    id: 'ar-6',
    name: 'Petal Theory',
    avatar:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    bio: 'Dream pop project led by multi-instrumentalist Sarah Chen. Ethereal vocals over lush guitar textures.',
    monthlyListeners: 1567000,
  },
];

function artistById(id: string): Artist {
  return mockArtists.find((a) => a.id === id) || mockArtists[0];
}

export const mockTracks: Track[] = [
  {
    id: 'mock-1',
    title: 'Midnight Pulse',
    artist: 'Neon Cascade',
    artists: [artistById('ar-1')],
    album: 'Aurora',
    cover:
      'https://images.unsplash.com/photo-1614624532983-4e1f8f1b8a1f?w=400&h=400&fit=crop',
    duration: 214,
    streamUrl: MOCK_AUDIO,
    genre: 'Electronic',
  },
  {
    id: 'mock-2',
    title: 'Velvet Horizon',
    artist: 'Lunar Drift feat. Aurora Vale',
    artists: [artistById('ar-2'), artistById('ar-3')],
    album: 'Eclipse',
    cover:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    duration: 198,
    streamUrl: MOCK_AUDIO,
    genre: 'Ambient',
  },
  {
    id: 'mock-3',
    title: 'Crystal Cascade',
    artist: 'Aurora Vale',
    artists: [artistById('ar-3')],
    album: 'Prism',
    cover:
      'https://images.unsplash.com/photo-1518972559570-7cc1309f3119?w=400&h=400&fit=crop',
    duration: 243,
    streamUrl: MOCK_AUDIO,
    genre: 'Electronic',
  },
  {
    id: 'mock-4',
    title: 'Solar Flare',
    artist: 'Cosmic Tide feat. Neon Cascade',
    artists: [artistById('ar-4'), artistById('ar-1')],
    album: 'Radiance',
    cover:
      'https://images.unsplash.com/photo-1470225620780-dba6ba1d4acc?w=400&h=400&fit=crop',
    duration: 187,
    streamUrl: MOCK_AUDIO,
    genre: 'Psychedelic',
  },
  {
    id: 'mock-5',
    title: 'Deep Resonance',
    artist: 'Echo Chamber',
    artists: [artistById('ar-5')],
    album: 'Subharmonic',
    cover:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    duration: 256,
    streamUrl: MOCK_AUDIO,
    genre: 'Bass',
  },
  {
    id: 'mock-6',
    title: 'Glass Garden',
    artist: 'Petal Theory feat. Aurora Vale',
    artists: [artistById('ar-6'), artistById('ar-3')],
    album: 'Botanica',
    cover:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    duration: 201,
    streamUrl: MOCK_AUDIO,
    genre: 'Dream Pop',
  },
  {
    id: 'mock-7',
    title: 'Quantum Dance',
    artist: 'Neon Cascade',
    artists: [artistById('ar-1')],
    album: 'Aurora',
    cover:
      'https://images.unsplash.com/photo-1518972559570-7cc1309f3119?w=400&h=400&fit=crop',
    duration: 223,
    streamUrl: MOCK_AUDIO,
    genre: 'Electronic',
  },
  {
    id: 'mock-8',
    title: 'Ember Glow',
    artist: 'Lunar Drift feat. Echo Chamber',
    artists: [artistById('ar-2'), artistById('ar-5')],
    album: 'Eclipse',
    cover:
      'https://images.unsplash.com/photo-1470225620780-dba6ba1d4acc?w=400&h=400&fit=crop',
    duration: 195,
    streamUrl: MOCK_AUDIO,
    genre: 'Ambient',
  },
];

export const mockPlaylists: Playlist[] = [
  {
    id: 'pl-1',
    title: 'Recently Played',
    subtitle: 'Your latest listens',
    cover:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    tracks: mockTracks.slice(0, 5),
  },
  {
    id: 'pl-2',
    title: 'Popular Playlists',
    subtitle: 'Trending now',
    cover:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    tracks: mockTracks.slice(2, 7),
  },
  {
    id: 'pl-3',
    title: 'Top Chart',
    subtitle: 'Most played this week',
    cover:
      'https://images.unsplash.com/photo-1470225620780-dba6ba1d4acc?w=400&h=400&fit=crop',
    tracks: mockTracks.slice(1, 8),
  },
];

export const mockLyrics: LyricLine[] = [
  { time: 0, text: 'In the midnight pulse, we find our way' },
  { time: 4, text: 'Through the neon glow of the city lights' },
  { time: 8, text: 'Every heartbeat echoes through the haze' },
  { time: 12, text: 'And we dance until the morning breaks' },
  { time: 16, text: 'Velvet horizons calling out your name' },
  { time: 20, text: 'Crystal cascades falling like the rain' },
  { time: 24, text: 'Hold on to this moment, hold on tight' },
  { time: 28, text: "We're riding on the waves of the night" },
  { time: 32, text: 'Solar flares ignite the sky above' },
  { time: 36, text: 'Deep resonance, a song of endless love' },
  { time: 40, text: 'In the glass garden, we come alive' },
  { time: 44, text: 'Quantum dance, we survive and thrive' },
  { time: 48, text: 'Ember glow, a fire that never dies' },
  { time: 52, text: 'In this music, we are infinite' },
];

export const genres = [
  'Electronic',
  'Ambient',
  'Psychedelic',
  'Dream Pop',
  'Bass',
  'All',
];
