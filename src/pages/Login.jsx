import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, user } = res.data;

      login(token, user);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="page-glow grid-pattern flex min-h-full items-center justify-center px-5 py-12">
      <form
        onSubmit={handleSubmit}
        className="card-surface w-full max-w-md rounded-3xl border border-white bg-white/95 p-8 sm:p-10"
      >
        <div className="mb-8">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-xl text-white shadow-lg shadow-indigo-200">⌁</div>
          <p className="text-sm font-bold uppercase tracking-[.18em] text-indigo-600">Welcome back</p>
          <h1 className="display-font mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Sign in to your flow.</h1>
          <p className="mt-2 text-sm text-slate-500">Pick up where your team left off.</p>
        </div>

        <input
          type="email"
          placeholder="Email address"
          className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-xl">
          Continue to dashboard →
        </button>
        <p className="mt-6 text-center text-sm text-slate-500">New to FreelanceFlow? <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700">Create an account</Link></p>
      </form>
    </div>
  );
}
