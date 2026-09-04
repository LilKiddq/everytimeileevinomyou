import { motion } from 'framer-motion';
import { useAudioStore } from '@/store/audioStore';

export function Equalizer({ playing = true }: { playing?: boolean }) {
  const bars = [0, 1, 2, 3, 4];
  return (
    <div className="flex items-end gap-0.5 h-4">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-current"
          animate={
            playing
              ? { height: ['30%', '100%', '50%', '80%', '40%'] }
              : { height: '30%' }
          }
          transition={{
            duration: 0.8,
            repeat: playing ? Infinity : 0,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
          style={{ height: '30%' }}
        />
      ))}
    </div>
  );
}

export function PlayPauseIcon({ size = 24 }: { size?: number }) {
  const isPlaying = useAudioStore((s) => s.isPlaying);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      {isPlaying ? (
        <rect x="6" y="5" width="4" height="14" rx="1" />
      ) : null}
      {isPlaying ? (
        <rect x="14" y="5" width="4" height="14" rx="1" />
      ) : (
        <path d="M8 5v14l11-7z" />
      )}
    </svg>
  );
}

export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
