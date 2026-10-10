import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Success() {
  const [params] = useSearchParams();

  useEffect(() => {
    const sessionId = params.get("session_id");

    if (sessionId) {
      activateSubscription(sessionId);
    }
  }, []);

  const activateSubscription = async (sessionId) => {
    try {
      await API.get(`/stripe-success?session_id=${sessionId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-glow grid min-h-full place-items-center px-5 py-12 text-center">
      <div className="card-surface max-w-md rounded-3xl border border-white bg-white p-10"><div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-600">✓</div><h1 className="display-font text-2xl font-extrabold text-slate-900">Subscription activated!</h1><p className="mt-3 text-slate-500">Your workspace is ready for projects and collaboration.</p><Link to="/dashboard" className="mt-7 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700">Go to dashboard →</Link></div>
    </div>
  );
}
