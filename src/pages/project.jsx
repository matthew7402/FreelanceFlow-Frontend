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
    <div className="page-glow flex min-h-[calc(100vh-72px)] flex-col px-4 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
      <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 sm:px-7">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white">◈</div>
        <div><p className="display-font font-bold text-slate-900">Project conversation</p><p className="flex items-center gap-1.5 text-xs text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Live collaboration</p></div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/70 p-5 sm:p-7">
        {messages.length === 0 && <div className="grid h-full min-h-64 place-items-center text-center"><div><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-xl text-indigo-600">✦</div><p className="display-font font-bold text-slate-800">Start the conversation</p><p className="mt-1 text-sm text-slate-500">Share an update, question, or next step with your team.</p></div></div>}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-5 flex flex-col ${
              msg.sender_id === user.id ? "text-right" : "text-left"
            }`}
          >
            <span className={`mb-1 text-xs font-bold ${msg.sender_id === user.id ? "text-indigo-600" : "text-slate-500"}`}>
              {msg.sender_name || "User"}
            </span>

            <p className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-left text-sm leading-6 ${msg.sender_id === user.id ? "self-end rounded-tr-sm bg-indigo-600 text-white" : "self-start rounded-tl-sm border border-slate-100 bg-white text-slate-700 shadow-sm"}`}>
              {msg.content}
            </p>

            <div className="mt-1 text-xs text-slate-400">
              {new Date(msg.created_at).toLocaleTimeString()}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t border-slate-100 bg-white p-4 sm:p-5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          placeholder="Type a message..."
        />

        <button
          onClick={sendMessage}
          className="rounded-xl bg-indigo-600 px-5 font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
      </div>
    </div>
  );
}
