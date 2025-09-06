

'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion'; // to add animation to enhance UX exprerience of users,.

const NavPart = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;

    setLoading(true);

    await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/logout`, {
      method: 'GET',
      credentials: 'include',
    }); 

    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <nav className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg p-4 rounded-2xl shadow-xl fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] z-50">

      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <h1 className="text-xl font-extrabold text-blue-600">
          <Link href="/profile">Linterest</Link>
        </h1>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col items-center justify-center w-10 h-10 gap-1"
            aria-label="Toggle Menu"
          >
            <span
              className={`block w-8 h-1 rounded bg-gray-800 dark:bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
            />
            <span
              className={`block w-8 h-1 rounded bg-gray-800 dark:bg-white transition-opacity ${menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
            />
            <span
              className={`block w-8 h-1 rounded bg-gray-800 dark:bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
            />
          </button>
        </div>

        {/* Desktop Navigation buttons */}
        <div className="hidden md:flex items-center gap-4">
          {/* Feed Button */}
          <button
            onClick={() => router.push('/feed')}
            className="px-4 py-2 font-semibold text-white rounded-2xl shadow-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 hover:scale-105 transition-all duration-300"
          >
            View Feed
          </button>

          {/* AI chat Button */}
          <button
            onClick={() => router.push('/ai-chat')}
            className="px-4 py-2 font-semibold text-white rounded-2xl shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 hover:scale-105 transition-all duration-300"
          >
            AI Chat
          </button>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 font-semibold text-white rounded-2xl shadow-lg bg-red-500 hover:bg-red-600 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>


      {/* Mobile menu, This one.  */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3 mt-4 md:hidden"
          >
            <button
              onClick={() => { router.push('/feed'); setMenuOpen(false); }}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 hover:from-blue-500 hover:to-green-400 transition-all duration-300"
            >
              View Feed
            </button>

            <button
              onClick={() => { router.push('/ai-chat'); setMenuOpen(false); }}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 hover:from-pink-500 hover:to-purple-500 transition-all duration-300"
            >
              Chatbot
            </button>

            <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              disabled={loading}
              className="px-4 py-2 rounded-2xl bg-red-500 text-white font-semibold shadow-lg hover:bg-red-600 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavPart;