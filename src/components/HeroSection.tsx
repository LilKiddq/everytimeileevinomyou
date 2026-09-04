import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ThumbsUp, ThumbsDown, Sliders } from 'lucide-react';
import { useAudioStore } from '@/store/audioStore';
import { mockTracks, genres } from '@/lib/mockData';

export function HeroSection() {
  const playTrack = useAudioStore((s) => s.playTrack);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const currentTrack = useAudioStore((s) => s.currentTrack);
  const toggleLike = useAudioStore((s) => s.toggleLike);
  const isLiked = useAudioStore((s) => s.isLiked);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [showGenres, setShowGenres] = useState(false);

  const handlePlay = () => {
    const filtered =
      selectedGenre === 'All'
        ? mockTracks
        : mockTracks.filter((t) => t.genre === selectedGenre);
    const pool = filtered.length > 0 ? filtered : mockTracks;
    const track = pool[Math.floor(Math.random() * pool.length)];
    playTrack(track, pool);
  };

  const handleLike = () => {
    if (currentTrack) toggleLike(currentTrack.id);
  };

  const handleDislike = () => {
    // Skip to next track
    useAudioStore.getState().next();
  };

  const activeId = currentTrack?.id;
  const liked = activeId ? isLiked(activeId) : false;

  return (
    <div className="px-4 mb-6">
      <div className="relative w-full rounded-3xl overflow-hidden border border-white/5">
        {/* Ambient mesh background */}
        <div className="absolute inset-0 bg-zinc-950" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(236,72,153,0.25), transparent 50%), radial-gradient(circle at 80% 70%, rgba(249,115,22,0.2), transparent 50%), radial-gradient(circle at 50% 50%, rgba(132,204,22,0.1), transparent 60%)',
              'radial-gradient(circle at 70% 20%, rgba(236,72,153,0.2), transparent 50%), radial-gradient(circle at 30% 80%, rgba(249,115,22,0.25), transparent 50%), radial-gradient(circle at 60% 40%, rgba(132,204,22,0.12), transparent 60%)',
              'radial-gradient(circle at 40% 60%, rgba(236,72,153,0.22), transparent 50%), radial-gradient(circle at 90% 30%, rgba(249,115,22,0.18), transparent 50%), radial-gradient(circle at 20% 50%, rgba(132,204,22,0.1), transparent 60%)',
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Content */}
        <div className="relative px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Glowing orb */}
            <div className="relative shrink-0">
              <motion.div
                className="absolute inset-0 rounded-full blur-2xl"
                animate={{
                  background: [
                    'radial-gradient(circle, rgba(236,72,153,0.6), transparent 70%)',
                    'radial-gradient(circle, rgba(249,115,22,0.5), transparent 70%)',
                    'radial-gradient(circle, rgba(236,72,153,0.6), transparent 70%)',
                  ],
                  scale: isPlaying ? [1, 1.15, 1] : 1,
                }}
                transition={{
                  background: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                  scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                }}
              />
              <motion.button
                onClick={handlePlay}
                whileTap={{ scale: 0.93 }}
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 flex items-center justify-center shadow-2xl"
              >
                {/* Inner ring */}
                <motion.div
                  className="absolute inset-2 rounded-full border-2 border-white/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                {/* Audio visualizer bars inside orb */}
                <div className="absolute inset-0 flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 bg-white/40 rounded-full"
                      animate={
                        isPlaying
                          ? { height: [8, 28, 14, 22, 10] }
                          : { height: 6 }
                      }
                      transition={{
                        duration: 0.6,
                        repeat: isPlaying ? Infinity : 0,
                        delay: i * 0.08,
                        ease: 'easeInOut',
                      }}
                      style={{ height: 6 }}
                    />
                  ))}
                </div>
                {/* Play icon overlay */}
                {!isPlaying && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white" className="relative z-10">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </motion.button>
            </div>

            {/* Text + controls */}
            <div className="flex-1 text-center sm:text-left">
              <span className="text-white/50 text-xs font-medium uppercase tracking-wider">
                Personal Mix
              </span>
              <h2 className="text-white text-3xl sm:text-4xl font-bold mt-1 mb-4 tracking-tight">
                My Wave
              </h2>

              {/* Like / Dislike / Genre controls */}
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={handleLike}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                    liked
                      ? 'bg-pink-500/20 border-pink-500/40 text-pink-400'
                      : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ThumbsUp size={16} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={handleDislike}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ThumbsDown size={16} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setShowGenres(!showGenres)}
                  className={`flex items-center gap-1.5 px-3 h-10 rounded-full border text-sm font-medium transition-colors ${
                    showGenres
                      ? 'bg-white/15 border-white/20 text-white'
                      : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Sliders size={14} />
                  <span>{selectedGenre}</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Genre selector */}
          <AnimatePresenceGenre show={showGenres} selectedGenre={selectedGenre} onSelect={setSelectedGenre} />
        </div>
      </div>
    </div>
  );
}

function AnimatePresenceGenre({
  show,
  selectedGenre,
  onSelect,
}: {
  show: boolean;
  selectedGenre: string;
  onSelect: (g: string) => void;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ height: show ? 'auto' : 0, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t border-white/5">
        {genres.map((g) => (
          <motion.button
            key={g}
            whileTap={{ scale: 0.93 }}
            onClick={() => onSelect(g)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedGenre === g
                ? 'bg-white text-black'
                : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            {g}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
