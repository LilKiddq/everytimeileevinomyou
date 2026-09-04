import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudioStore } from '@/store/audioStore';

export function LyricsView() {
  const lyrics = useAudioStore((s) => s.lyrics);
  const currentTime = useAudioStore((s) => s.currentTime);
  const seek = useAudioStore((s) => s.seek);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  // Find active line
  let activeIndex = -1;
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
      break;
    }
  }

  // Auto-scroll to active line
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const active = activeRef.current;
      const containerHeight = container.clientHeight;
      const activeTop = active.offsetTop;
      const activeHeight = active.offsetHeight;
      const targetScroll = activeTop - containerHeight / 2 + activeHeight / 2;
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full overflow-hidden"
    >
      <div
        ref={containerRef}
        className="h-full overflow-y-auto no-scrollbar px-4 py-8"
      >
        <div className="space-y-4">
          {lyrics.map((line, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;
            return (
              <motion.div
                key={i}
                ref={isActive ? activeRef : null}
                onClick={() => seek(line.time)}
                whileTap={{ scale: 0.98 }}
                className={`cursor-pointer text-center text-lg font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white scale-105'
                    : isPast
                    ? 'text-white/30'
                    : 'text-white/50 hover:text-white/70'
                }`}
                style={{
                  textShadow: isActive
                    ? '0 0 20px rgba(255,255,255,0.3)'
                    : 'none',
                }}
              >
                {line.text || '♪'}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
