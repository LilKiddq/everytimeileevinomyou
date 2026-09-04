import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Users } from 'lucide-react';
import { useArtistModalStore } from '@/store/artistModalStore';
import { useAudioStore } from '@/store/audioStore';
import { mockTracks } from '@/lib/mockData';
import { ArtistAvatar } from './ArtistAvatar';
import { Equalizer, formatTime } from './Equalizer';

export function ArtistPageModal() {
  const artist = useArtistModalStore((s) => s.selectedArtist);
  const isOpen = useArtistModalStore((s) => s.isOpen);
  const close = useArtistModalStore((s) => s.closeArtist);
  const playTrack = useAudioStore((s) => s.playTrack);
  const currentTrack = useAudioStore((s) => s.currentTrack);
  const isPlaying = useAudioStore((s) => s.isPlaying);

  if (!artist) return null;

  const artistTracks = mockTracks.filter((t) =>
    t.artists.some((a) => a.id === artist.id)
  );

  // Discography: unique albums
  const albums = Array.from(new Set(artistTracks.map((t) => t.album)));

  const handlePlayTrack = (trackId: string) => {
    const track = artistTracks.find((t) => t.id === trackId);
    if (track) playTrack(track, artistTracks);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={close}
          />

          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-zinc-900/95 border border-white/10 overflow-hidden flex flex-col"
          >
            {/* Header with artist image */}
            <div className="relative h-48 shrink-0">
              <div className="absolute inset-0 bg-gradient-to-b from-pink-500/20 to-transparent" />
              <img
                src={artist.avatar}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
              <button
                onClick={close}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-4 left-6">
                <h1 className="text-white text-3xl font-bold tracking-tight">{artist.name}</h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <Users size={13} className="text-white/50" />
                  <span className="text-white/50 text-sm">
                    {formatListeners(artist.monthlyListeners)} monthly listeners
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
              {/* Bio */}
              <div className="mb-6">
                <h2 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">About</h2>
                <p className="text-white/70 text-sm leading-relaxed">{artist.bio}</p>
              </div>

              {/* Popular tracks */}
              <div className="mb-6">
                <h2 className="text-white text-lg font-bold mb-3">Popular Tracks</h2>
                <div className="space-y-1">
                  {artistTracks.map((track, i) => {
                    const isActive = currentTrack?.id === track.id;
                    return (
                      <motion.button
                        key={track.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePlayTrack(track.id)}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors text-left"
                      >
                        <span className="text-white/30 text-sm w-6 text-center">
                          {isActive && isPlaying ? <Equalizer playing={true} /> : i + 1}
                        </span>
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
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
                          <p className="text-white/40 text-xs truncate">{track.album}</p>
                        </div>
                        <span className="text-white/30 text-xs tabular-nums shrink-0">
                          {formatTime(track.duration)}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Discography */}
              <div>
                <h2 className="text-white text-lg font-bold mb-3">Discography</h2>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {albums.map((album) => {
                    const albumTrack = artistTracks.find((t) => t.album === album);
                    return (
                      <div key={album} className="w-32 shrink-0">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden mb-2 shadow-lg">
                          {albumTrack?.cover ? (
                            <img src={albumTrack.cover} alt={album} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-pink-500 to-orange-400" />
                          )}
                        </div>
                        <h3 className="text-white text-sm font-medium truncate">{album}</h3>
                        <p className="text-white/40 text-xs">{artist.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatListeners(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}
