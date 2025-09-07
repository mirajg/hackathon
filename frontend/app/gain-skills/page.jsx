

'use client';
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// below is lists of videos, to gain the some skills, Fetched from YT. ,

const videos = [
    { title: "Fundamentals of Graphics Designing", url: "https://www.youtube.com/embed/GQS7wPujL2k?si=0qjTwLScQI7mJKxS" },
    { title: "The Principles of Design", url: "https://www.youtube.com/embed/9EPTM91TBDU?si=CLhNBqsuX40BDlS4" },
    { title: "The Elements of Design", url: "https://www.youtube.com/embed/MshxnTQW4qU?si=rCveQ151jv5edger" },
    { title: "Rules of Composition", url: "https://www.youtube.com/embed/r6LPNRVhGKA?si=bqcvtM0exU6nQt5O" },
    { title: "Decades of Design", url: "https://www.youtube.com/embed/xfL2f_rMyiw?si=IBw5BwhVUwCVErT8" },
    { title: "Color Theory for Beginners", url: "https://www.youtube.com/embed/PIa17rsNSEE?si=FzSW5x8spMRIHz3X" },
    { title: "Different Terms of Designing", url: "https://www.youtube.com/embed/6Jlo9iOZvXY?si=SeeH6oDN2dKJgoKF" },
    { title: "Learn the Psychology of Fonts", url: "https://www.youtube.com/embed/VqfGq8wJ968?si=wZEg1f-yzBDOfCrA" },
    { title: "Design the Cover of Magazines", url: "https://www.youtube.com/embed/DBHBmeNhYrY?si=PKfMKlrgt0CrQKX0" },
    { title: "Learn About Visual Hierarchy", url: "https://www.youtube.com/embed/TrkiAsCJPJo?si=82juURCmpQoUPrMw" },
    { title: "Logo Designing of Movies", url: "https://www.youtube.com/embed/HcOc7P5BMi4?si=jEDttiQGesxkEIDX" },
    { title: "Learn the Basics of HTML", url: "https://www.youtube.com/embed/ESnrn1kAD4E?si=eSxHYokID1AAJfXD" },
    { title: "Learn the Basics of CSS", url: "https://www.youtube.com/embed/nGhKIC_7Mkk?si=4D0XMkGZrmddCCiJ" },
    { title: "Building the Clone of Amazon's Site", url: "https://www.youtube.com/embed/Ez8F0nW6S-w?si=N_drNnr5mOWuzvWF" },
    { title: "Learn the Basics of Git and GitHub", url: "https://www.youtube.com/embed/ajdRvxDWH4w?si=CagR94H3udj5MqRi" },
    { title: "Lecture:1 Learn the Basics of JavaScript", url: "https://www.youtube.com/embed/Zg4-uSjxosE?si=4-eFbM3XCU6Z24yv" },
    { title: "Lecture:2 Learn Operators and Conditional Statements of JS", url: "https://www.youtube.com/embed/UmRtFFSDSFo?si=cJLdkpO3wOaw9dcW" },
    { title: "Lecture:3 Learn Loops and Strings of JS", url: "https://www.youtube.com/embed/gFWhbjzowrM?si=kJrO0Q0Twnp-WtAs" },
    { title: "Lecture:4 Learn Arrays Used in JS", url: "https://www.youtube.com/embed/P0XMXqDGttU?si=RpZ4B3PYVUPVZL8f" },
    { title: "Lecture:5 Learn Functions and Methods", url: "https://www.youtube.com/embed/7zcXPCt8Ck0?si=lH_caTZ4hALvJJcv" },
    { title: "Lecture:6 Learn DOM - Document Object Model", url: "https://www.youtube.com/embed/fXAGTOZ25H8?si=q3AWeKFr6NKEKlX8" },
    { title: "Lecture:7 Learn DOM (part-2)", url: "https://www.youtube.com/embed/_i-uLJAh79U?si=KtG1h5deXx7LQSw4" },
    { title: "Lecture:8 Learn Events in JavaScript", url: "https://www.youtube.com/embed/SqrppLEljkY?si=lTr3wp-_lNIClU56" },
    { title: "Lecture:9 Learn the Making of Tic Tac Toe in JS", url: "https://www.youtube.com/embed/_V33HCZWLDQ?si=pdiERRmQy_ZkUy2A" },
    { title: "Lecture 10: MiniProject - Stone, Paper & Scissors Game", url: "https://www.youtube.com/embed/N-O4w6PynGY?si=vNEHVW7kLgG_avtM" },
    { title: "Lecture 11: Learn Classes and Objects", url: "https://www.youtube.com/embed/d3jXofmQm44?si=hTmS6VUe21VKQiD_" },
    { title: "Lecture 12: Learn Callbacks, Promises & Async Await", url: "https://www.youtube.com/embed/CyGodpqcid4?si=luv7ye71oJ6LE9By" },
    { title: "Last Lecture: Learn How to Fetch API with Project", url: "https://www.youtube.com/embed/4WjtQjPQGIs?si=JyGZ1HtU8c9DFKzu" }
];


const VideoCard = ({ title, url }) => (
    <motion.div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl"
        whileHover={{ scale: 1.05, rotate: -1 }}
        transition={{ duration: 0.2 }}
    >
        <iframe
            className="w-full h-56"
            src={url}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
        />
        <h2 className="text-lg font-semibold p-4 text-gray-800">{title}</h2>
    </motion.div>
);

export default function GainSkills() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* this is the header page, of beloww.  */}

            <Link href="/"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300"
            > ← Back </Link>


            <header className="animated-gradient text-white py-10 text-center shadow-lg">
                <h1 className="text-5xl md:text-6xl font-extrabold animate-bounce">
                    Gain Skills 🚀
                </h1>
                <p className="mt-4 text-xl md:text-2xl font-medium opacity-90">
                    Master Graphics Design & Web Development Like a Pro
                </p>
            </header>

            {/* Main Content of this page, is pf below., */}
            <main className="w-full px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {videos.map((video, idx) => (
                        <VideoCard key={idx} {...video} />
                    ))}
                </div>
            </main>

            <style>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient {
          background: linear-gradient(270deg, #2563eb, #9333ea, #f59e0b, #ef4444);
          background-size: 800% 800%;
          animation: gradientFlow 12s linear infinite;
        }
      `}</style>
        </div>
    );
}
