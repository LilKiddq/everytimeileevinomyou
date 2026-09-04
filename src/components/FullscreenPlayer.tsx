import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Shuffle,
  Repeat,
  Repeat1,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Mic2,
  Heart,
  MoreHorizontal,
} from 'lucide-react';
import { useAudioStore } from '@/store/audioStore';
import { useArtistModalStore } from '@/store/artistModalStore';
import { PlayPauseIcon, formatTime } from './Equalizer';
import { ArtistAvatar } from './ArtistAvatar';
import { rgbToCss } from '@/lib/color';
import { LyricsView } from './LyricsView';

export function FullscreenPlayer() {
  const isOpen = useAudioStore((s) => s.isFullscreenOpen);
  const setOpen = useAudioStore((s) => s.setFullscreenOpen);
  const currentTrack = useAudioStore((s) => s.currentTrack);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const togglePlay = useAudioStore((s) => s.togglePlay);
  const next = useAudioStore((s) => s.next);
  const prev = useAudioStore((s) => s.prev);
  const seek = useAudioStore((s) => s.seek);
  const currentTime = useAudioStore((s) => s.currentTime);
  const duration = useAudioStore((s) => s.duration);
  const volume = useAudioStore((s) => s.volume);
  const setVolume = useAudioStore((s) => s.setVolume);
  const muted = useAudioStore((s) => s.muted);
  const toggleMute = useAudioStore((s) => s.toggleMute);
  const shuffle = useAudioStore((s) => s.shuffle);
  const toggleShuffle = useAudioStore((s) => s.toggleShuffle);
  const repeat = useAudioStore((s) => s.repeat);
  const toggleRepeat = useAudioStore((s) => s.toggleRepeat);
  const showLyrics = useAudioStore((s) => s.showLyrics);
  const toggleLyrics = useAudioStore((s) => s.toggleLyrics);
  const dominantColor = useAudioStore((s) => s.dominantColor);
  const prevDominantColor = useAudioStore((s) => s.prevDominantColor);
  const trackDirection = useAudioStore((s) => s.trackDirection);
  const toggleLike = useAudioStore((s) => s.toggleLike);
  const isLiked = useAudioStore((s) => s.isLiked);
  const openArtist = useArtistModalStore((s) => s.openArtist);

  const seekRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (currentTrack) setLiked(isLiked(currentTrack.id));
  }, [currentTrack, isLiked]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      else if (e.code === 'Escape') setOpen(false);
      else if (e.code === 'ArrowRight') next();
      else if (e.code === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, togglePlay, setOpen, next, prev]);

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekRef.current) return;
    const rect = seekRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    seek(Math.max(0, Math.min(1, pct)) * duration);
  };

  const bg = rgbToCss(dominantColor, 0.6);
  const bgDark = rgbToCss(dominantColor, 0.3);
  const prevBg = rgbToCss(prevDominantColor, 0.6);
  const prevBgDark = rgbToCss(prevDominantColor, 0.3);

  const slideDirection =
    trackDirection === 'next' ? -100 : trackDirection === 'prev' ? 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 overflow-hidden"
        >
          {/* Dynamic background with cross-fade */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                `radial-gradient(circle at 30% 20%, ${prevBg}, ${prevBgDark} 60%, #000 100%)`,
                `radial-gradient(circle at 30% 20%, ${bg}, ${bgDark} 60%, #000 100%)`,
                `radial-gradient(circle at 70% 80%, ${bg}, ${bgDark} 60%, #000 100%)`,
              ],
            }}
            transition={{ duration: 1.2, times: [0, 0.3, 1], ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 backdrop-blur-3xl" />
          {currentTrack.cover && (
            <div
              className="absolute inset-0 opacity-20 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentTrack.cover})` }}
            />
          )}

          <div className="relative h-full flex flex-col max-w-2xl mx-auto px-6 pt-4 pb-8">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4 shrink-0">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setOpen(false)} className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white">
                <ChevronDown size={26} />
              </motion.button>
              <div className="text-center">
                <p className="text-white/50 text-xs uppercase tracking-wider">Playing from</p>
                <p className="text-white text-sm font-medium">{currentTrack.album}</p>
              </div>
              <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white">
                <MoreHorizontal size={22} />
              </motion.button>
            </div>

            {/* Main content - cover or lyrics */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0">
              <AnimatePresence mode="wait">
                {showLyrics ? (
                  <LyricsView key="lyrics" />
                ) : (
                  <motion.div
                    key={currentTrack.id}
                    initial={{ opacity: 0, x: slideDirection, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: isPlaying ? 1 : 0.9 }}
                    exit={{ opacity: 0, x: -slideDirection, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                    className="relative w-full max-w-sm aspect-square"
                  >
                    <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                      {currentTrack.cover ? (
                        <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-pink-500 to-orange-400" />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Track info with cross-fade */}
            <div className="mt-6 mb-4 shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTrack.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <h1 className="text-white text-2xl font-bold truncate">{currentTrack.title}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <ArtistAvatar
                        artists={currentTrack.artists}
                        size={24}
                        onClick={openArtist}
                      />
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {currentTrack.artists.map((a, i) => (
                          <span key={a.id} className="text-white/60 text-lg">
                            <button
                              onClick={() => openArtist(a)}
                              className="hover:text-white hover:underline transition-colors"
                            >
                              {a.name}
                            </button>
                            {i < currentTrack.artists.length - 1 && <span className="text-white/40">,</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => {
                      setLiked(!liked);
                      toggleLike(currentTrack.id);
                    }}
                    className="shrink-0 ml-4"
                  >
                    <Heart size={26} className={liked ? 'text-pink-500 fill-pink-500' : 'text-white/60 hover:text-white'} />
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Seek bar */}
            <div className="mb-4 shrink-0">
              <div ref={seekRef} onClick={handleSeekClick} className="group relative h-6 flex items-center cursor-pointer">
                <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-white rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.1 }} />
                </div>
                <motion.div className="absolute w-3 h-3 rounded-full bg-white shadow-lg pointer-events-none" style={{ left: `calc(${progress}% - 6px)` }} whileHover={{ scale: 1.3 }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-white/50 text-xs tabular-nums">{formatTime(currentTime)}</span>
                <span className="text-white/50 text-xs tabular-nums">{formatTime(duration || currentTrack.duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-4 shrink-0">
              <motion.button whileTap={{ scale: 0.85 }} onClick={toggleShuffle} className={`w-10 h-10 flex items-center justify-center transition-colors ${shuffle ? 'text-pink-400' : 'text-white/50 hover:text-white'}`}>
                <Shuffle size={20} />
              </motion.button>
              <motion.button whileTap={{ scale: 0.85 }} onClick={prev} className="w-12 h-12 flex items-center justify-center text-white">
                <SkipBack size={28} fill="white" />
              </motion.button>
              <motion.button whileTap={{ scale: 0.88 }} onClick={togglePlay} className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black shadow-xl">
                <PlayPauseIcon size={30} />
              </motion.button>
              <motion.button whileTap={{ scale: 0.85 }} onClick={next} className="w-12 h-12 flex items-center justify-center text-white">
                <SkipForward size={28} fill="white" />
              </motion.button>
              <motion.button whileTap={{ scale: 0.85 }} onClick={toggleRepeat} className={`w-10 h-10 flex items-center justify-center transition-colors ${repeat !== 'off' ? 'text-pink-400' : 'text-white/50 hover:text-white'}`}>
                {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
              </motion.button>
            </div>

            {/* Volume + lyrics */}
            <div className="flex items-center gap-3 shrink-0">
              <motion.button whileTap={{ scale: 0.85 }} onClick={toggleMute} className="text-white/50 hover:text-white transition-colors">
                {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </motion.button>
              <div onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); const pct = (e.clientX - rect.left) / rect.width; setVolume(Math.max(0, Math.min(1, pct))); }} className="flex-1 h-6 flex items-center cursor-pointer">
                <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-white/60 rounded-full" animate={{ width: `${muted ? 0 : volume * 100}%` }} />
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.85 }} onClick={toggleLyrics} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${showLyrics ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}>
                <Mic2 size={16} /><span>Lyrics</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
