
'use client';

// handle incase of error. Detects.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ErrorPage({ error, reset }) {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/profile'); // Redirect to profile page after 5 seconds of delay. Incase some falut deteccts.
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-md text-center"
            >
                <h1 className="text-6xl font-extrabold text-red-600 mb-4 animate-pulse">😵 Oops!</h1>
                <p className="text-gray-700 mb-6 text-lg">
                    Something went wrong. Don't worry, we'll take you back to your profile.
                </p>
                <button
                    onClick={() => router.push('/profile')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition transform hover:scale-105"
                >
                    Go to Profile Now
                </button>
                <p className="mt-4 text-gray-500 text-sm">
                    Redirecting automatically in 5 seconds...
                </p>
            </motion.div>
        </div>
    );
}
