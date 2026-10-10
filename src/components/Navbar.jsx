import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-5 py-3 backdrop-blur-xl sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
      <div
        className="flex cursor-pointer items-center gap-3"
        onClick={() => navigate("/")}
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-lg text-white shadow-lg shadow-indigo-200">⌁</span>
        <span className="display-font text-lg font-extrabold tracking-tight text-slate-900">Freelance<span className="text-indigo-600">Flow</span></span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {user ? (
          <>
            <Link to="/dashboard" className="hidden text-sm font-semibold text-slate-600 transition hover:text-indigo-600 sm:block">
              Dashboard
            </Link>
            
            <span className="max-w-28 truncate rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 sm:max-w-44">
              {user.name || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="text-sm font-semibold text-slate-600 transition hover:text-indigo-600">
              Login
            </Link>
            <Link to="/register" className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600">
              Register
            </Link>
          </>
        )}
      </div>
      </div>
    </nav>
  );
}
