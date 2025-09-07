
// this is notification page. Helps to manage all notify ofh users,. 

'use client';

import React from 'react';
import { useAuth } from '../userInfoContext';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const NotificationPage = () => {
    const { data: session } = useSession();
    const { notificationreceive, notificationOpen, setNotificationOpen } = useAuth();

    return (
      // framer motion helps to animate the layout of frontend. WHich make look cool 
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed inset-0 z-50 ${notificationOpen ? "flex" : "hidden"} 
        items-center justify-center bg-black/40 backdrop-blur-sm`}
        >
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white w-full max-w-md mx-4 sm:mx-0 rounded-2xl shadow-2xl overflow-hidden relative"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-purple-600">Notifications</h3>
                    <button
                        onClick={() => setNotificationOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition text-lg"
                    >
                        ✕
                    </button>
                </div>

                {/* Below one is list of all notifications. */}
                <div className="px-6 py-5 max-h-[24rem] overflow-y-auto">
                    {notificationreceive.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-6">
                            No new notifications 🎉
                        </p>
                    ) : (
                        <ul className="space-y-4">
                            {notificationreceive.map((notification) => (
                                <Link onClick={() => setNotificationOpen(false)} href={`/profile/${notification.sender._id}`} key={notification._id}>
                                    <motion.li
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
                                    >
                                        {/* here, first letter of name is showwn in the circle,  */}
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                                            {notification.sender?.name?.charAt(0) || "?"}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold text-purple-600">
                                                    {notification.sender?.name}
                                                </span>{" "}
                                                {notification.notice}
                                            </p>
                                            <span className="text-xs text-gray-400 block mt-1">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </motion.li>
                                </Link>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 text-right">
                    <button
                        onClick={() => setNotificationOpen(false)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium hover:opacity-90 transition"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default NotificationPage;
