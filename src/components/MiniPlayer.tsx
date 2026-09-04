import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useAudioStore } from '@/store/audioStore';
import { useArtistModalStore } from '@/store/artistModalStore';
import { Equalizer, PlayPauseIcon, formatTime } from './Equalizer';
import { ArtistAvatar } from './ArtistAvatar';

export function MiniPlayer() {
  const currentTrack = useAudioStore((s) => s.currentTrack);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const togglePlay = useAudioStore((s) => s.togglePlay);
  const setFullscreenOpen = useAudioStore((s) => s.setFullscreenOpen);
  const currentTime = useAudioStore((s) => s.currentTime);
  const duration = useAudioStore((s) => s.duration);
  const openArtist = useArtistModalStore((s) => s.openArtist);

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      layoutId="player-container"
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      <div className="h-0.5 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-500 to-orange-400"
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'linear', duration: 0.3 }}
        />
      </div>

      <motion.div
        layoutId="player-bar"
        className="bg-black/70 backdrop-blur-xl border-t border-white/5"
      >
        <div className="flex items-center gap-3 px-3 py-2.5">
          {/* Cover with cross-fade */}
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrack.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                {currentTrack.cover ? (
                  <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-500 to-orange-400" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Info with cross-fade */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrack.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-white text-sm font-medium truncate">{currentTrack.title}</h3>
                  {isPlaying && <Equalizer playing={true} />}
                </div>
                <div className="flex items-center gap-1.5">
                  <ArtistAvatar artists={currentTrack.artists} size={16} onClick={openArtist} />
                  <div className="flex items-center gap-1 truncate">
                    {currentTrack.artists.map((a, i) => (
                      <span key={a.id} className="text-white/50 text-xs truncate">
                        <button onClick={(e) => { e.stopPropagation(); openArtist(a); }} className="hover:text-white hover:underline transition-colors">
                          {a.name}
                        </button>
                        {i < currentTrack.artists.length - 1 && <span className="text-white/30">, </span>}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Time (desktop) */}
          <div className="hidden sm:block text-white/40 text-xs tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black shrink-0"
          >
            <PlayPauseIcon size={20} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setFullscreenOpen(true)}
            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors shrink-0"
          >
            <ChevronUp size={20} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
