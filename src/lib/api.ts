import type { Track, LyricLine } from '@/types';
import { mockTracks } from './mockData';

// Актуальный список публичных зеркал Piped
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://api.piped.privacydev.net',
  'https://pipedapi.tokhmi.xyz',
  'https://pipedapi.moomoo.me',
  'https://pipedapi.ync.moe'
];

interface PipedSearchResult {
  url: string;
  title: string;
  thumbnail: string;
  uploaderName: string;
  duration: number;
}

// Умный запрос с перебором зеркал
async function fetchFromPiped(endpoint: string) {
  for (const baseUrl of PIPED_INSTANCES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // Таймаут 4 сек на инстанс

      const res = await fetch(`${baseUrl}${endpoint}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return await res.json();
      }
    } catch {
      continue; // Пробуем следующий сервер
    }
  }
  throw new Error('All Piped instances failed');
}

export async function searchTracks(query: string): Promise<Track[]> {
  if (!query.trim()) return mockTracks;
  try {
    const data = await fetchFromPiped(
      `/search?q=${encodeURIComponent(query)}&filter=music`
    );
    const items: PipedSearchResult[] = data.items || [];
    
    return items
      .filter((item) => item.url && item.url.includes('/watch?v='))
      .slice(0, 25)
      .map((item, i) => {
        const videoId = item.url.split('?v=')[1]?.split('&')[0] || '';
        const artistName = item.uploaderName || 'Unknown Artist';
        
        return {
          id: `piped-${videoId || i}`,
          title: item.title || 'Unknown',
          artist: artistName,
          artists: [
            { 
              id: `ar-${videoId || i}`, 
              name: artistName, 
              avatar: item.thumbnail || '', 
              bio: '', 
              monthlyListeners: 0 
            }
          ],
          album: 'Single',
          cover: item.thumbnail || '',
          duration: item.duration || 0,
          videoId,
        } as Track;
      });
  } catch {
    return mockTracks;
  }
}

export async function getStreamUrl(videoId: string): Promise<string | null> {
  if (!videoId) return null;

  for (const baseUrl of PIPED_INSTANCES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${baseUrl}/streams/${videoId}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) continue;

      const data = await res.json();
      const audioStreams = data.audioStreams || [];

      // Приоритет: m4a (AAC) -> webm (Opus) -> любой первый аудиопоток
      const stream = 
        audioStreams.find((s: { mimeType: string }) => s.mimeType?.includes('m4a')) ||
        audioStreams.find((s: { mimeType: string }) => s.mimeType?.includes('webm')) ||
        audioStreams[0];

      if (stream?.url) {
        return stream.url;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export async function getLyrics(
  artist: string,
  title: string
): Promise<LyricLine[] | null> {
  try {
    const res = await fetch(
      `https://lrclib.net/api/get?artist_name=${encodeURIComponent(
        artist
      )}&track_name=${encodeURIComponent(title)}`
    );
    if (!res.ok) throw new Error('Lyrics fetch failed');
    const data = await res.json();

    if (data.syncedLyrics) {
      return parseLrc(data.syncedLyrics);
    }
    if (data.plainLyrics) {
      return data.plainLyrics
        .split('\n')
        .map((text: string, i: number) => ({ time: i * 4, text }));
    }
    return null;
  } catch {
    return null;
  }
}

export function parseLrc(lrc: string): LyricLine[] {
  const lines = lrc.split('\n');
  const result: LyricLine[] = [];
  const timeRegex = /\[(\d+):(\d+)\.(\d+)\]/g;

  for (const line of lines) {
    const matches = [...line.matchAll(timeRegex)];
    const text = line.replace(timeRegex, '').trim();
    for (const m of matches) {
      const min = parseInt(m[1]);
      const sec = parseInt(m[2]);
      const ms = parseInt(m[3]);
      const time = min * 60 + sec + ms / 1000;
      result.push({ time, text });
    }
  }
  return result.sort((a, b) => a.time - b.time);
}
