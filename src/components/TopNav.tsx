import { useState, useRef, useEffect } from 'react';
import { Search, X, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import type { FilterType } from '@/types';
import { useAudioStore } from '@/store/audioStore';
import { searchTracks } from '@/lib/api';
import { mockTracks } from '@/lib/mockData';
import { UserProfileDropdown } from './UserProfileDropdown';

interface TopNavProps {
  activeFilter: FilterType;
  onFilterChange: (f: FilterType) => void;
  onSearchResults: (tracks: typeof mockTracks) => void;
}

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'tracks', label: 'Tracks' },
  { key: 'artists', label: 'Artists' },
  { key: 'albums', label: 'Albums' },
];

export function TopNav({ activeFilter, onFilterChange, onSearchResults }: TopNavProps) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentTrack = useAudioStore((s) => s.currentTrack);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      onSearchResults(mockTracks);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      const results = await searchTracks(query);
      onSearchResults(results);
      setSearching(false);
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="sticky top-0 z-30 px-4 pt-4 pb-3 bg-black/40 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
            <Music size={18} className="text-white" />
          </div>
          <span className="hidden sm:block text-white text-lg font-bold tracking-tight">epicmuse</span>
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-white/40 transition-opacity ${searching ? 'opacity-100 animate-pulse' : 'opacity-40'}`} size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists, albums..."
            className="w-full bg-white/10 border border-white/10 rounded-full pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:bg-white/15 focus:border-white/20 transition-all"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>

        {/* User profile */}
        <UserProfileDropdown />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {filters.map((f) => (
          <button key={f.key} onClick={() => onFilterChange(f.key)} className="relative px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors">
            <span className={activeFilter === f.key ? 'text-white' : 'text-white/50 hover:text-white/70'}>{f.label}</span>
            {activeFilter === f.key && (
              <motion.div layoutId="filter-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {currentTrack && <div className="h-2" />}
    </div>
  );
}
