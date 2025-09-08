
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // in Next 13+ of apP router
import { motion } from 'framer-motion';
import { signIn, signOut, useSession } from "next-auth/react";

export default function Signup() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ email: '', password: '', isGoogle: false });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',  // <- This is important cause, it helps to send cookies related info. 
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/profile/${data.user._id}`);
      } else {
        alert(`Log-in failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Server error. Try again later.');
    }
  };

  const handleLoginGoogle = async (e) => {
    await signIn("google");
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm"
      >
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="off"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="off"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Log In
            </button>
          </form>

          <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-sm text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            type="button"
            onClick={handleLoginGoogle}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg shadow-md hover:bg-red-600 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.9 0 6.6 1.7 8.1 3.1l6-6C34.2 3.5 29.5 1.5 24 1.5 14.8 1.5 7 8.2 4.6 17h7.5c1.5-4.8 6-7.5 11.9-7.5z" />
              <path fill="#34A853" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.6 3.2-2.6 5.9-5.6 7.7l8.6 6.7c5-4.6 7.7-11.4 7.7-18.9z" />
              <path fill="#4A90E2" d="M9.1 28.5c-1.3-3.9-1.3-8.1 0-12L.5 10.5c-4.2 8.3-4.2 18.2 0 26.5l8.6-6.5z" />
              <path fill="#FBBC05" d="M24 46.5c6.5 0 12-2.1 16-5.8l-8.6-6.7c-2.4 1.6-5.5 2.6-8.9 2.6-5.9 0-10.4-2.7-11.9-7.5H4.6C7 39.8 14.8 46.5 24 46.5z" />
            </svg>
            Sign in with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
              Create one
            </Link>
          </p>
        </>
      </motion.div>
    </div>
  );
}