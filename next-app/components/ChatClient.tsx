"use client";

import { socket } from "@/lib/socketClient";
import { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";

interface IMessage {
  createdAt: string;
  id: number;
  text: string;
  username: string;
}

export default function ChatClient() {
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => setMessages(data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("connected to socket", socket.id);
    });

    socket.on("message", (messages) => {
      console.log("messages", messages);

      setMessages((prevState) => [...prevState, messages]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendViaNextApi = async () => {
    if (!username || !text) return alert("Enter username and text");

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, text }),
    });

    setText("");
  };

  const sendDirectSocket = () => {
    if (!username || !text) return alert("Enter username and text");

    socketRef.current?.emit("sendMessage", { username, text });

    setText("");
  };

  console.log("messages", messages);

  return (
    <div className="max-w-4xl mx-auto">
      <div style={{ marginBottom: 12 }}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name"
          className="border py-2 px-4 border-gray-200"
        />
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          padding: 12,
          minHeight: 200,
          marginBottom: 12,
        }}
      >
        {messages.map((message) => (
          <div key={message.id} style={{ marginBottom: 8 }}>
            <strong>{message.username}</strong>: {message.text}
            <div style={{ fontSize: 12, color: "#666" }}>
              {new Date(message.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          style={{ flex: 1 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="border py-2 px-4 border-gray-200"
        />

        <div className="flex gap-4">
          <button
            className="whitespace-nowrap w-full border rounded py-2 px-4 border-blue-500 cursor-pointer bg-blue-100 hover:bg-blue-200"
            onClick={sendViaNextApi}
          >
            Send (via Next API)
          </button>
          <button
            className="whitespace-nowrap w-full border rounded py-2 px-4 border-blue-500 cursor-pointer bg-blue-100 hover:bg-blue-200"
            onClick={sendDirectSocket}
          >
            Send (direct socket)
          </button>
        </div>
      </div>
    </div>
  );
}
