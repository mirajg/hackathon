
// This is the page for an AI chatbot interface created with lots of Love  using api key of Sarvam AI .

'use client'

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../components/Loading";
import NavPart from "../components/NavPart";
import Link from "next/link";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loadingPage, setLoadingPage] = useState(true);
    const chatBoxRef = useRef(null);

    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    const API_URL = "https://api.sarvam.ai/v1/chat/completions";

    const addMessage = (text, sender) => {
        setMessages((prev) => [...prev, { text, sender }]);
    };

    const sendMessage = async () => {
        // This is area use to send message to the sarvam ai (Indian AI chatbot). Response will
        //  be shown in the user in real time. 
        if (!input.trim()) return;

        const userText = input;
        addMessage(userText, "user");
        setInput("");

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: "sarvam-m",
                    messages: [
                        { role: "system", content: "You are a helpful AI assistant." },
                        { role: "user", content: userText },
                    ],
                }),
            });

            const data = await res.json();
            const botReply = data.choices?.[0]?.message?.content || "No response";
            addMessage(botReply, "bot");
        } catch (err) {
            addMessage("Error: " + err.message, "bot");
        }
    };

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);


    //This is  Fake loading for 1s to show loader. To make look highly professional and attractive ,.
    useEffect(() => {
        const timer = setTimeout(() => setLoadingPage(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (loadingPage) {
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <Loading /> {/* loading compon ents to show load*/}
            </div>
        );
    }

    return (
        <>
            <NavPart /> {/*  this is navpart */}
            <div className="flex shadow-[0_4px_20px_rgba(0,0,0,0.3)] justify-center items-end h-screen p-5 font-sans">
                <motion.div
                    className="flex flex-col w-full max-w-md h-[80vh] bg-[rgba(20,20,30,0.9)] backdrop-blur-md rounded-xl shadow-lg overflow-hidden text-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center justify-between bg-[#4e3496] px-4 py-3 rounded-t-xl font-bold text-lg text-white">
                        <span className="flex-1 text-center mr-10">💬 AI Chatbot</span>
                    </div>

                    {/* Chat Box area. */}
                    <div ref={chatBoxRef} className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
                        <AnimatePresence>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`p-3 rounded-xl text-sm break-words whitespace-pre-wrap font-mono ${msg.sender === "user" ? "bg-[#00b894] self-end" : "bg-[#636e72] self-start"
                                        }`}
                                >
                                    {msg.sender === "bot" && msg.text.startsWith("```") ? (
                                        <pre>{msg.text.replace(/```/g, "")}</pre>
                                    ) : (
                                        msg.text
                                    )}
                                </motion.div>
                            ))}
                            {messages.length === 0 && (
                                <p className="text-center italic font-bold text-[#a29bfe]">Type something</p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Input page, here. */}
                    <div className="flex items-center border-t border-gray-700 p-3 bg-[#1a1a1a]/70 backdrop-blur-md">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2 rounded-full border border-gray-600 bg-[#2d3436] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#00cec9] focus:border-[#00cec9] transition"
                        />
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={sendMessage}
                            className="ml-3 px-6 py-2 rounded-full bg-gradient-to-r from-[#00cec9] to-[#0984e3] text-white font-semibold shadow-md hover:shadow-lg transition"
                        >
                            Send
                        </motion.button>
                    </div>

                </motion.div>
            </div>
        </>
    );
};

export default Chatbot;