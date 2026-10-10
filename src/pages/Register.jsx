import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", { name, email, password });
      alert("Registered successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Register failed");
    }
  };

  return (
    <div className="page-glow grid-pattern flex min-h-full items-center justify-center px-5 py-12">
      <form
        className="card-surface w-full max-w-md rounded-3xl border border-white bg-white/95 p-8 sm:p-10"
        onSubmit={handleSubmit}
      >
        <div className="mb-8">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-xl text-white shadow-lg shadow-indigo-200">✦</div>
          <p className="text-sm font-bold uppercase tracking-[.18em] text-indigo-600">Start collaborating</p>
          <h1 className="display-font mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Create your workspace.</h1>
          <p className="mt-2 text-sm text-slate-500">A simpler way to manage client work.</p>
        </div>

        <input
          type="text"
          placeholder="Your name"
          className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email address"
          className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Create a password"
          className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-xl">
          Create account →
        </button>
        <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link to="/" className="font-bold text-indigo-600 hover:text-indigo-700">Sign in</Link></p>
      </form>
    </div>
  );
}
