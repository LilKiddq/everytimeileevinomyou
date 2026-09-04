import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Track, FilterType } from '@/types';
import { mockPlaylists, mockTracks } from '@/lib/mockData';
import { useAudioStore } from '@/store/audioStore';
import { useArtistModalStore } from '@/store/artistModalStore';
import { TopNav } from './TopNav';
import { HeroSection } from './HeroSection';
import { ContentRow } from './ContentRow';
import { Equalizer, formatTime } from './Equalizer';
import { ArtistAvatar } from './ArtistAvatar';

export function MainScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchResults, setSearchResults] = useState<Track[]>(mockTracks);

  const isSearching = searchResults !== mockTracks;

  return (
    <div className="min-h-screen pb-24">
      <TopNav
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onSearchResults={setSearchResults}
      />

      {isSearching ? (
        <div className="px-4 mt-2">
          <h2 className="text-white text-lg font-bold mb-3">Search Results</h2>
          <div className="space-y-1">
            {searchResults.map((track, i) => (
              <SearchResultRow key={track.id} track={track} index={i} queue={searchResults} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <HeroSection />
          {mockPlaylists.map((pl) => (
            <ContentRow key={pl.id} playlist={pl} />
          ))}
        </>
      )}
    </div>
  );
}

function SearchResultRow({ track, index, queue }: { track: Track; index: number; queue: Track[] }) {
  const playTrack = useAudioStore((s) => s.playTrack);
  const currentTrack = useAudioStore((s) => s.currentTrack);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const openArtist = useArtistModalStore((s) => s.openArtist);
  const isActive = currentTrack?.id === track.id;

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => playTrack(track, queue)}
      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors text-left"
    >
      <span className="text-white/30 text-sm w-6 text-center">
        {isActive && isPlaying ? <Equalizer playing={true} /> : index + 1}
      </span>
      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
        {track.cover ? (
          <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-500 to-orange-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-medium truncate ${isActive ? 'text-pink-400' : 'text-white'}`}>
          {track.title}
        </h3>
        <div className="flex items-center gap-1.5">
          <ArtistAvatar artists={track.artists} size={16} onClick={openArtist} />
          <p className="text-white/50 text-xs truncate flex-1">{track.artist}</p>
        </div>
      </div>
      <span className="text-white/30 text-xs tabular-nums shrink-0">
        {formatTime(track.duration)}
      </span>
    </motion.button>
  );
}
