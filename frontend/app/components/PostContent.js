
// this is teh the page. Use to post the content like we use to do in tiktok, facebook, but here, only image and text 
// is acceptable by our Linterest Software
'use client';

import React, { useState } from 'react';
import { useAuth } from '../userInfoContext';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const PostContent = ({ userId }) => {
    const { data: session } = useSession();
    const { isHiddenPostContent, setIsHiddenPostContent } = useAuth();

    const [desc, setDesc] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);


    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!desc && !imageFile) {
            alert("Please add a description & image before uploading.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("description", desc);
            formData.append("image", imageFile);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKENDPATH}/api/create-post/${userId}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Upload failed");

            alert("Post uploaded successfully!");
            setDesc("");
            setImageFile(null);
            setPreviewUrl(null);
            setIsHiddenPostContent(true); 
        } catch (err) {
            console.error(err);
            alert("Error uploading post.");
        } finally {
            setLoading(false);
        }
    };

    if (!userId) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`fixed inset-0 z-50 ${isHiddenPostContent ? "hidden" : "flex"
                } items-center justify-center bg-black/40 backdrop-blur-sm p-4`}
        >
            <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="w-full max-w-2xl max-h-[80vh] scrollbar-hidden overflow-y-auto bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 transition-all duration-300 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-100"
            >

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-indigo-700">Create Post</h1>
                    <button
                        type="button"
                        onClick={() => setIsHiddenPostContent(true)}
                        className="text-2xl font-bold text-indigo-500 hover:text-red-500 transition-all duration-200 transform hover:scale-110"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-[120px] h-[120px] overflow-hidden border-4 border-indigo-400 shadow-md mb-3">
                        {previewUrl ? (
                            <Image
                                src={previewUrl}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                No Image
                            </div>
                        )}
                    </div>
                    <label className="cursor-pointer px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg">
                        Add Image
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </label>
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="desc-content"
                        className="block text-indigo-700 font-semibold mb-2"
                    >
                        Write something here...
                    </label>
                    <textarea
                        id="desc-content"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        rows={4}
                        className="w-full resize-none px-4 py-3 border border-indigo-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300
          ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105"
                        }`}
                >
                    {loading ? "Uploading..." : "Post"}
                </button>
            </form>
        </motion.div>
    );
};

export default PostContent;
