import { motion } from 'framer-motion';
import type { Artist } from '@/types';

interface ArtistAvatarProps {
  artists: Artist[];
  size?: number;
  onClick?: (artist: Artist) => void;
  className?: string;
}

export function ArtistAvatar({ artists, size = 28, onClick, className = '' }: ArtistAvatarProps) {
  if (artists.length === 0) return null;

  if (artists.length === 1) {
    return (
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(artists[0]);
        }}
        className={`shrink-0 rounded-full overflow-hidden ring-2 ring-white/10 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={artists[0].avatar}
          alt={artists[0].name}
          className="w-full h-full object-cover"
        />
      </motion.button>
    );
  }

  // Multi-artist overlapping layout
  const overlap = size * 0.35;
  const totalWidth = size + (artists.length - 1) * (size - overlap);

  return (
    <div
      className={`flex items-center shrink-0 ${className}`}
      style={{ width: totalWidth, height: size }}
    >
      {artists.slice(0, 2).map((artist, i) => (
        <motion.button
          key={artist.id}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(artist);
          }}
          className="relative rounded-full overflow-hidden ring-2 ring-black"
          style={{
            width: size,
            height: size,
            marginLeft: i === 0 ? 0 : -overlap,
            zIndex: artists.length - i,
          }}
        >
          <img
            src={artist.avatar}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        </motion.button>
      ))}
    </div>
  );
}
