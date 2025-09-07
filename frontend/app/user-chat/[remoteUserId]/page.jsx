
'use client'

import { UseOwnInfo } from "@/app/components/FetchOwnInfo";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const socket = io(process.env.NEXT_PUBLIC_BACKENDPATH);

export default function userChat() {
  const params = useParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const router = useRouter();

  const { user, loadingBackend, sessionStatus: backendStatus } = UseOwnInfo();
  const [myId, setMyId] = useState(user?.userId || "");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?.userId) {
      setMyId(user?.userId || "");

      if (params?.remoteUserId !== "" && (params?.remoteUserId === user?.userId)) {
        router.push("/profile");
      }
      socket.emit("register-user", { userId: user?.userId });
    }
  }, [user?.userId, params?.remoteUserId]);


  useEffect(() => {
    if (user?.userId && params?.remoteUserId) {
      const fetchMessages = async () => {

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKENDPATH}/api/messages?userId=${user?.userId}&remoteUserId=${params?.remoteUserId}`
        );

        const data = await response.json();
        setMessages(data.messages);
      };

      fetchMessages();
    }
  }, [user?.userId, params?.remoteUserId]);


  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {

      setMessages((prev) => [...prev, message]);
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, []);


  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { _id: Date.now(), senderId: { _id: myId }, text: input }; // temporary id, this one. 

    setMessages([...messages, newMessage]);
    setInput("");

    fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        remoteUserId: params?.remoteUserId,

        userId: user?.userId,
        text: input,
      }),
    });

    socket.emit('update-message-to-remote-user', {
      newMessage, userId: params?.remoteUserId
    });
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex  max-h-screen w-full flex-col h-screen bg-gray-100">
      
      <div className="p-4 flex items-center bg-white shadow  justify-between">
        <h1 className="text-lg font-semibold">Chat with User</h1>
      </div>

      {/* all messeges render to here; */}
      <div className="p-4 space-y-3 flex-1 overflow-y-auto ">

        {myId &&
          messages.map((msg, index) => (
            <div
              key={msg._id || index}
              className={`flex ${msg.senderId?._id === myId ? "justify-end" : "justify-start"
                }`}
            >

              <div
                className={`px-4 py-2 rounded-2xl max-w-xs shadow text-sm md:text-base 
                ${msg.senderId?._id === myId
                    ? "text-white bg-blue-500 "
                    : "bg-gray-200 text-gray-900"
                  }`}
              >

                {msg.content || msg.text}
              </div>
            </div>
          ))}

        {/* this one is used to make auto scroll to bottom, cool experience */}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white flex items-center gap-2 border-t">
        <input

          type="text"
          placeholder="Type a messagem here..."

          value={input}
          onChange={(e) => setInput(e.target.value)}

          onKeyDown={(e) => e.key === "Enter" && sendMessage()}

          className="flex-1 focus:outline-none border rounded-full px-4 py-2 focus:ring-2   focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}

          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
