
'use client'; // this one client component, 
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// === thi,s one is use to make animated, animation ko lai ho yo chahi ===
const fadeUp = {
  hidden: { opacity: 0},
  visible: (i = 1) => ({
    opacity: 1,
    transition: { // yesko bapat animate hunxa. 
      delay: i * 0.2,


      duration: 0.6,

      ease: 'easeOut',
    },
  }),
};




// aaba HomePages tart hunxa
const HomePage = () => {
  return (
    <div className="bg-white    text-gray-900 font-sans">

      {/* yo head ho */}
      <header className="w-full  flex justify-between items-center px-8 md:px-16 py-6 shadow-sm">
        <motion.h1
          className="text-2xl  font-bold text-blue-500 hover:text-blue-700 transition cursor-pointer"
        >

          Linterest
        </motion.h1>

        {/* sing in start hunxa yha bata */}
        <nav className="space-x-6">
          <Link href="/signup " className=" transition text-gray-700  font-bold hover:text-blue-600">
            Sign Up
          </Link>
          {/* href yha xa login ko lagi */}
          <Link href="/login" className="text-gray-700  font-bold hover:text-blue-600 transition">
            Log In
          </Link>


        </nav>
      </header>

      {/* yo hero section ho */}
      <section className="relative w-full h-screen  flex flex-col md:flex-row items-center justify-between px-8 md:px-16">
        <motion.div


          className="flex-1 mb-10 md:mb-0" // yha animation junxa
          initial="hidden"

          animate="visible"
          variants={fadeUp}
        >
          <h1 className="text-5xl  md:text-6xl font-bold mb-6 leading-tight">
            Your Dream Job <span className="text-blue-800 text-7xl">Awaits</span> <br />
            & Real-Time Connection
          </h1>


          <p className="text-gray-600 mb-8  max-w-md">


            Linterest is more than a job platform. Chat, collaborate, and Connect in real-time, with AI-powered chatbots and communication tools—all in one app.
          </p>
          <div className="flex gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105 transition-transform duration-300"
            >
              Get Started
            </Link>
          </div>

        </motion.div>

        {/* yha bata illustration   hunxa= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* img ko lagi  */}
          <Image
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="app ui illustration"
            width={500}
            height={400}
            priority

            className="rounded-2xl  shadow-xl hover:scale-105 hover:rotate-z-5 hover:shadow-2xl transition-all duration-500 transform hover:brightness-110 border border-gray-200 hover:border-indigo-400"
          />
        </motion.div>
      </section>











      <section className="py-20  md:flex-row flex flex-col   text-center justify-center gap-16 bg-gray-50">
        {[
          { label: 'Active Users', value: '50k+' },
          { label: 'Jobs Posted', value: '10k+' },


          { label: 'Real-Time Chats', value: '100k+' },


          { label: 'Success Rate', value: '95%' },
        ].map((stat, i) => (
          <motion.div
            key={`${i}`}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="animate-fade-up"
          >


            <h2 className="text-4xl font-bold md:text-5xl  text-blue-600">{stat.value}</h2>
            <p className="text-gray-600 mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </section>


      <section className="py-20 md:px-12 px-6  bg-gray-100">
        <motion.h2
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-4xl text-center mb-10 font-bold "
        >
          Why Choose Linterest?
        </motion.h2>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center  text-gray-600 mb-16   max-w-2xl mx-auto"
        >
          Linterest is an all-in-one platform for jobs, communication, and AI-powered interactions.
        </motion.p>

        <div className="grid  md:grid-cols-3 grid-cols-1   gap-8">
          {[
            { icon: '🔍', title: 'Smart Job Matching', desc: 'Connects talent to opportunity.' },
            { icon: '💬', title: 'Real-Time Chat', desc: 'Instantly communicate with people.' },
            { icon: '🤖', title: 'AI Chatbot', desc: 'Get assistance, and smart replies from AI.' },
            { icon: '🎯', title: 'Targeted Hiring', desc: 'Hire smarter with solutions that connect you to the right talent at the right time.' },
            { icon: '⚡', title: 'Lightning Fast', desc: 'Quick access to opportunities & instant communication.' },
            { icon: '📹', title: 'More', desc: 'Explore more features designed to enhance your job search and networking experience with Linterest' },
          ].map((feature, index) => (
            <motion.div
              key={`${index}`}
              custom={index}
              initial="hidden"

              animate="visible"
              variants={fadeUp}
              className="p-6 bg-white duration-300 text-center rounded-xl  transition  hover:-translate-y-2 shadow hover:shadow-lg"
            >
              <div className="text-6xl">{feature.icon}</div>
              <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* aaba footer start hunxa === */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="py-12 bg-blue-700 text-white text-center"
      >
        <h2 className="font-bold text-xl mb-4">💼 Linterest</h2>
        <p className="mb-2">Connecting talent, enabling real-time communication, and AI-powered support—all in one app (SuperApp).</p>
        <p className="text-sm">© 2025 Linterest. All rights reserved.</p>
      </motion.footer>

    </div>
  );
};

export default HomePage;
