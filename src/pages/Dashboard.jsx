import { useState, useEffect } from "react";
import API from "../api/api";
import WorkspaceCard from "../components/WorkspaceCard";

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const res = await API.get("/workspaces");
      setWorkspaces(res.data);
    } catch (err) {
      alert("Failed to fetch workspaces");
    }
  };

  const createWorkspace = async () => {
    const name = prompt("Workspace name");
    if (!name) return;

    try {
      await API.post("/workspaces", { name });
      // The creation response does not include membership role details.
      // Reloading provides the complete workspace shape used by the card.
      await fetchWorkspaces();
    } catch (err) {
      alert("Failed to create workspace");
    }
  };

  return (
    <div className="page-glow min-h-full px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[.18em] text-indigo-600">Your command center</p>
            <h1 className="display-font text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Workspaces that move work forward.</h1>
            <p className="mt-3 max-w-xl text-slate-500">Bring your projects, collaborators, and client conversations into one focused place.</p>
          </div>
          <button onClick={createWorkspace} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700">
            <span className="text-lg leading-none">+</span> Create workspace
          </button>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200">{workspaces.length} workspace{workspaces.length === 1 ? "" : "s"}</span>
          <span className="text-sm text-slate-500">Select a workspace to continue.</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {workspaces.length ? workspaces.map((ws) => (
          <WorkspaceCard key={ws.id} workspace={ws} />
        )) : (
          <div className="card-surface col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-2xl">✦</div>
            <h2 className="display-font text-xl font-bold text-slate-800">Start with your first workspace</h2>
            <p className="mt-2 text-slate-500">Create a home for your next client project.</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
