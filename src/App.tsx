import { useEffect } from 'react';
import { MainScreen } from '@/components/MainScreen';
import { MiniPlayer } from '@/components/MiniPlayer';
import { FullscreenPlayer } from '@/components/FullscreenPlayer';
import { AuthModal } from '@/components/AuthModal';
import { ArtistPageModal } from '@/components/ArtistPageModal';
import { initAudioEvents } from '@/store/audioStore';
import { useAuthStore } from '@/store/authStore';

function App() {
  const initAuth = useAuthStore((s) => s.init);

  useEffect(() => {
    initAudioEvents();
    initAuth();
  }, [initAuth]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ambient gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-zinc-900 via-black to-black" />
      <div className="fixed top-0 left-0 right-0 h-96 -z-10 bg-gradient-to-b from-pink-900/20 via-transparent to-transparent" />

      <MainScreen />
      <MiniPlayer />
      <FullscreenPlayer />
      <AuthModal />
      <ArtistPageModal />
    </div>
  );
}

export default App;
