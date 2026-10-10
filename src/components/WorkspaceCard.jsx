import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function WorkspaceCard({ workspace }) {
  const navigate = useNavigate();
  const handleSubscribe = async (e) => {
    e.stopPropagation(); // prevent navigation

    try {
      const res = await API.post(
        `/workspaces/${workspace.id}/create-checkout-session`
      );

      // Redirect to Stripe checkout
      window.location.href = res.data.checkoutUrl;
    } catch (err) {
      console.error(err);
      alert("Failed to start subscription");
    }
  };

  return (
    <div
      className="card-surface group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
      onClick={() =>
         {if(workspace.subscription_status==='active')
        navigate(`/workspace/${workspace.id}`);
      else alert("Workspace needs to be activated first");}}
    >
      <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600">⌘</div>
      <h2 className="display-font pr-20 text-xl font-bold text-slate-900">{workspace.name}</h2>
      <p className="mt-2 text-sm text-slate-500">You are an <span className="font-semibold capitalize text-slate-700">{workspace.role}</span> in this workspace.</p>
      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-indigo-600">Open workspace <span className="transition group-hover:translate-x-1">→</span></div>

      {/* ACTIVATE BUTTON: only for owners */}
     {workspace.role === "owner" && workspace.subscription_status === "inactive" && (
        <button
          onClick={handleSubscribe}
          className="absolute right-5 top-5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Activate
        </button>
      )}

      {workspace.subscription_status === "active" && (
        <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
        </span>
      )}
    </div>
  );
}
