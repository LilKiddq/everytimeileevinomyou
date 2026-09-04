import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Heart, LogOut, ChevronDown, Crown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function UserProfileDropdown() {
  const user = useAuthStore((s) => s.user);
  const isOpen = useAuthStore((s) => s.authModalOpen);
  const setAuthModalOpen = useAuthStore((s) => s.setAuthModalOpen);
  const setAuthModalMode = useAuthStore((s) => s.setAuthModalMode);
  const signOut = useAuthStore((s) => s.signOut);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setAuthModalMode('login');
            setAuthModalOpen(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
        >
          Sign In
        </button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setAuthModalMode('register');
            setAuthModalOpen(true);
          }}
          className="px-4 py-2 text-sm font-semibold rounded-full bg-white text-black hover:bg-white/90 transition-colors"
        >
          Register
        </motion.button>
      </div>
    );
  }

  const email = user.email || '';
  const initials = email.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white text-sm font-bold">
          {initials}
        </div>
        <ChevronDown
          size={14}
          className={`text-white/50 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl"
          >
            {/* Profile header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white text-lg font-bold">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{email}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Crown size={12} className="text-amber-400" />
                    <span className="text-amber-400/80 text-xs font-medium">Premium</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-1.5">
              <DropdownItem icon={<User size={16} />} label="Profile" onClick={() => setDropdownOpen(false)} />
              <DropdownItem icon={<Heart size={16} />} label="Liked Songs" onClick={() => setDropdownOpen(false)} />
              <DropdownItem icon={<Settings size={16} />} label="Settings" onClick={() => setDropdownOpen(false)} />
              <div className="h-px bg-white/5 my-1" />
              <DropdownItem
                icon={<LogOut size={16} />}
                label="Sign Out"
                onClick={() => {
                  setDropdownOpen(false);
                  signOut();
                }}
                danger
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        danger
          ? 'text-red-400 hover:bg-red-500/10'
          : 'text-white/70 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
