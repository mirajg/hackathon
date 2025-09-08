
// this is feed page and use to show content of user, i mean what they have pushed. 

"use client";
import React, { useState, useEffect } from "react";
import NavPart from "../components/NavPart";
import Loading from "../components/Loading";
import { motion } from "framer-motion";
import Link from "next/link";
import CommentPost from "../components/CommentPost";
import { UseOwnInfo } from "../components/FetchOwnInfo";
import { useAuth } from "../userInfoContext";

const FeedPage = () => {
    const [activeTab, setActiveTab] = useState("jobPosts");
    const { activeCommentPostId, setActiveCommentPostId } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, loadingBackend, sessionStatus: backendStatus } = UseOwnInfo();


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);

                let url = "";

                // to know which tab is active right now,
                if (activeTab === "jobPosts") {
                    url = `${process.env.NEXT_PUBLIC_BACKENDPATH}/api/jobs-post`;
                } else {
                    url = `${process.env.NEXT_PUBLIC_BACKENDPATH}/api/contentPosts`;
                }

                const res = await fetch(url);
                const data = await res.json();

                if (activeTab === "jobPosts") {
                    setPosts(data.jobs || []);
                } else {
                    setPosts(data.posts || []);
                }


                // add a tiny delay so UI doesn’t flicker instantly
                setTimeout(() => setLoading(false), 500);

            } catch (error) {
                console.error("Error fetching posts:", error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [activeTab]);

    console.log('hi'); 
    
    

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    // this one is for delete job post,
    const handleDeleteJobPost = async (postId) => {
        try {
            let response = confirm("Are you sure you want to delete this post?");
            if (!response) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/posts/${postId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
                alert('Post deleted successfully');
            } else {
                console.error("Error deleting post:", res.statusText);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    // this one is for delete contents posts
    const handleDeleteContentPost = async (postId) => {
        try {
            let response = confirm("Are you sure you want to delete this post?");
            if (!response) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/contentPosts/${postId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
                alert('Post deleted successfully');
            } else {
                console.error("Error deleting post:", res.statusText);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleApply = async (postId, requestSendUserId, receiverId) => {

        let res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/posts/${postId}/apply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: requestSendUserId, receiverId, postId}), 
        });

        if (res.ok) {
            const data = await res.json();
            alert('Application successful');
        } else {
            console.error("Error applying for job:", res.statusText);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <NavPart />
            <div className="p-6 mt-[100px]">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab("jobPosts")}
                        className={`px-4 py-2 rounded-lg font-semibold transition 
      ${activeTab === "jobPosts"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300"} 
      w-full sm:w-auto text-center`}
                    >
                        See All Job Posts
                    </button>

                    <button
                        onClick={() => setActiveTab("allContentPosts")}
                        className={`px-4 py-2 rounded-lg font-semibold transition 
      ${activeTab === "allContentPosts"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300"} 
      w-full sm:w-auto text-center`}
                    >
                        See All Content Posts
                    </button>
                </div>


                <div>
                    {activeTab === "jobPosts" && (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <div
                                        key={post._id}
                                        className="group relative p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 
             hover:shadow-2xl hover:border-indigo-400 transition transform hover:-translate-y-2 hover:scale-[1.02] duration-300"
                                    >
                                        {user && user.userId === post.owner._id && (
                                            <button
                                                onClick={() => handleDeleteJobPost(post._id)}
                                                className="absolute top-4 right-4 text-red-500 hover:text-red-600 transition"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>)}


                                        <span className="block text-gray-500 dark:text-gray-400 text-xs mb-2">
                                            {new Date(post.createdAt).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                        </span>

                                        {/* title of the post */}
                                        <h3 className="font-extrabold text-lg text-gray-100 mb-1 transition">
                                            {post.title || "Untitled Job"}
                                        </h3>

                                        <Link
                                            href={post.owner ? `/profile/${post.owner._id}` : "#"}
                                            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors duration-200"
                                        >
                                            <span className="text-xs text-gray-400">From:</span>
                                            <span className="font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                                                {post.owner?.name || "Unknown User"}
                                            </span>
                                        </Link>


                                        {/* this is the job Descriptio,n */}
                                        <p className="text-gray-700 dark:text-gray-300 text-sm italic mb-4 line-clamp-3">
                                            {post.jobdesc || "No description available"}
                                        </p>

                                        {/* this one is the job detai.ls  */}
                                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                            <p>
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">🏢 Company:</span>{" "}
                                                {post.company || "N/A"}
                                            </p>
                                            <p>
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">📍 Location:</span>{" "}
                                                {post.location || "Remote"}
                                            </p>
                                            <p>
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">💰 Salary:</span>{" "}
                                                {post.salary || "Not disclosed"}
                                            </p>
                                        </div>

                                        {/* this is os for code related to apply for job post. */}
                                        <div className="mt-6 flex justify-center items-center">
                                            <button onClick={() => handleApply(post._id, user.userId, post.owner._id)} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 transition">
                                                Apply Now
                                            </button>
                                        </div>

                                        {/* to make cool effect in hover, great look show,  */}
                                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-indigo-400 transition duration-300 pointer-events-none"></div>
                                    </div>

                                ))
                            ) : (
                                <div className="col-span-full text-center py-10 text-gray-500">
                                    🚀 No job posts found
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "allContentPosts" && (
                        <div className="flex justify-center">
                            <div className="w-full max-w-xl space-y-6">
                                {posts.length > 0 ? (
                                    [...posts].reverse().map((post) => (
                                        <motion.div
                                            key={post._id}
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.2 }}
                                            transition={{ duration: 0.5 }}
                                            className="relative p-6 bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 
            hover:shadow-xl transition transform duration-300"
                                        >
                                            {user && (user.userId === post.owner._id) && (
                                                <button
                                                    onClick={() => handleDeleteContentPost(post._id)}
                                                    className="absolute top-4 right-4 text-red-500 hover:text-red-600 transition"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </button>)}
                                            {/* to show date of  */}
                                            <span className="block text-gray-500 dark:text-gray-400 text-xs mb-2">
                                                {new Date(post.createdAt).toLocaleString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}
                                            </span>

                                            <Link
                                                href={`/profile/${post.owner?._id}`}
                                                className="
              font-semibold text-indigo-600 dark:text-indigo-400
              text-center
              px-4 py-2
              rounded-xl
              transition-all duration-300
              hover:bg-indigo-100 dark:hover:bg-indigo-700
              hover:text-indigo-800 dark:hover:text-indigo-200
              shadow-sm hover:shadow-lg
              block
              transform hover:-translate-y-1 hover:scale-105"
                                            >
                                                {post.owner?.name || "Unknown User"}
                                            </Link>

                                            {/* this one to show the post text,  */}
                                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{post.postdesc}</p>

                                            {/* this one to show the image of thhe post  */}
                                            {post.image && (

                                                <div className="w-full h-full rounded-sm overflow-hidden border-4 border-indigo-300 shadow-lg hover:scale-105 transition-transform duration-300">
                                                    <img
                                                        src={post.image} 
                                                        alt="user avatar"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                            )}


                                            <div className="gap-4 mt-4">

                                                <button
                                                    onClick={() => setActiveCommentPostId(activeCommentPostId === post._id ? null : post._id)}
                                                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg font-medium shadow-sm hover:bg-green-100 dark:hover:bg-green-800 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105"
                                                >
                                                    Let's Comment
                                                </button>
                                            </div>


                                            {activeCommentPostId === post._id && user.userId && <CommentPost postId={post._id} userId={user.userId} />}

                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-10 text-gray-500">
                                        No Content posts found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </>
    );
};

export default FeedPage;
