

'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../userInfoContext';
import Link from 'next/link';

const CommentPost = ({ postId, userId }) => {
    const { data: session } = useSession();
    const [comments, setComments] = useState([]);

    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    const { activeCommentPostId, setActiveCommentPostId } = useAuth();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/comments?postId=${postId}`);
                const data = await res.json();

                setComments([...data.comments].reverse() || []);
            } catch (err) {
                console.error("Failed to fetch comments:", err);
            } finally {
                setLoading(false);
            }
        };

        if (postId) fetchComments();
    }, [postId]);

    const handlePostComment = async () => {
        if (!newComment.trim()) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, content: newComment, userId }),
            });

            const data = await res.json();

            setNewComment('');
            setActiveCommentPostId('');
        } catch (err) {
            console.error("Failed to post comment:", err);
        }
    };

    return (
        <AnimatePresence>
            {postId && (
                <motion.div
                    initial={{ opacity: 0 }}

                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}

                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 relative"
                    >
                        {/* close button layout,,this one */}
                        <button
                            onClick={() => setActiveCommentPostId('')}

                            className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 font-bold text-lg"
                        >
                            ✕
                        </button>

                        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Comments</h2>

                        {/*comments list is show into below,  */}
                        <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
                            {loading ? (
                                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                            ) : comments.length > 0 ? (
                                comments.map((c) => (
                                    <div key={c._id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <Link
                                            onClick={() => { setActiveCommentPostId(''); }}
                                            href={`/profile/${c.owner?._id}`}
                                            className="
                                                inline-block

                                                px-2 py-1
                                                text-sm font-semibold
                                                text-indigo-600 dark:text-indigo-400
                                                rounded-lg

                                                hover:bg-indigo-100 dark:hover:bg-indigo-800
                                                hover:text-indigo-800 dark:hover:text-indigo-200
                                                transition-all duration-300

                                                transform hover:-translate-y-0.5 hover:scale-105
                                                shadow-sm hover:shadow-md
                                            "
                                        >
                                            {c.owner?.name || "Unknown"}
                                        </Link>
                                        <span className="ml-1 text-gray-700 dark:text-gray-300">:</span>

                                        <p className="text-sm text-gray-700 break-all dark:text-gray-300">{c.text}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center">No comments yet</p>
                            )}
                        </div>

                        {userId && (
                            <div className="flex gap-2">
                                <input
                                    type="text"

                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}

                                    placeholder="Write a comment..."

                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                    onClick={handlePostComment}
                                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                                >
                                    Send
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
                
            )}
        </AnimatePresence>
    );
};

export default CommentPost;
