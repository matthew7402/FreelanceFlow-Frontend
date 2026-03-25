import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import  socket  from "../services/Socket";
import { jwtDecode } from "jwt-decode";

export default function Project() {
  const { id } = useParams(); // projectId

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef();

  const user = jwtDecode(localStorage.getItem("token"));; // must contain id

  // ✅ 1. Fetch old messages (VERY IMPORTANT)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get(`/messages/${id}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load messages");
      }
    };

    fetchMessages();
  }, [id]);

  // ✅ 2. Socket setup
  useEffect(() => {
    socket.connect();

    socket.emit("joinProject", id);

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("errorMessage", (err) => {
      alert(err);
    });

    return () => {
      socket.off("newMessage");
      socket.off("errorMessage");
      socket.disconnect();
    };
  }, [id]);

  // ✅ 3. Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ 4. Send message
  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("sendMessage", {
      projectId: id,
      senderId: user.id,
      content: input,
    });

    setInput("");
  };

  return (
    <div className="p-6 flex flex-col h-screen">
      <h1 className="text-2xl font-bold mb-4">Project Chat</h1>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto border p-4 rounded mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 ${
              msg.sender_id === user.id ? "text-right" : "text-left"
            }`}
          >
            <span className="font-semibold text-blue-600">
              {msg.sender_name || "User"}
            </span>

            <p className="bg-gray-100 inline-block px-3 py-1 rounded">
              {msg.content}
            </p>

            <div className="text-xs text-gray-400">
              {new Date(msg.created_at).toLocaleTimeString()}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="Type a message..."
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}