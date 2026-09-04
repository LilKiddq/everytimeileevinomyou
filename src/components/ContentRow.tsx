import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import type { Track, Playlist } from '@/types';
import { useAudioStore } from '@/store/audioStore';
import { useArtistModalStore } from '@/store/artistModalStore';
import { Equalizer } from './Equalizer';
import { ArtistAvatar } from './ArtistAvatar';

function TrackCard({ track, queue }: { track: Track; queue: Track[] }) {
  const playTrack = useAudioStore((s) => s.playTrack);
  const currentTrack = useAudioStore((s) => s.currentTrack);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const openArtist = useArtistModalStore((s) => s.openArtist);
  const isActive = currentTrack?.id === track.id;

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => playTrack(track, queue)}
      className="group relative w-40 shrink-0 text-left"
    >
      <div className="relative w-40 h-40 rounded-2xl overflow-hidden mb-2 shadow-lg">
        {track.cover ? (
          <img src={track.cover} alt={track.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <span className="text-white/30 text-3xl font-bold">{track.title.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <motion.div initial={{ scale: 0, opacity: 0 }} whileHover={{ scale: 1, opacity: 1 }} className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
            {isActive && isPlaying ? <Equalizer playing={true} /> : <Play size={20} className="text-black ml-0.5" fill="black" />}
          </motion.div>
        </div>
        {isActive && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md">
            <Equalizer playing={isPlaying} />
          </div>
        )}
      </div>
      <h3 className="text-white text-sm font-medium truncate">{track.title}</h3>
      <div className="flex items-center gap-1.5 mt-0.5">
        <ArtistAvatar artists={track.artists} size={16} onClick={openArtist} />
        <p className="text-white/50 text-xs truncate flex-1">{track.artist}</p>
      </div>
    </motion.button>
  );
}

export function ContentRow({ playlist }: { playlist: Playlist }) {
  return (
    <div className="mb-6">
      <div className="px-4 mb-3 flex items-center justify-between">
        <h2 className="text-white text-lg font-bold">{playlist.title}</h2>
        <span className="text-white/40 text-xs">{playlist.subtitle}</span>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
        {playlist.tracks.map((track) => (
          <TrackCard key={track.id} track={track} queue={playlist.tracks} />
        ))}
      </div>
    </div>
  );
}
