import { useState, useEffect } from "react";
import API from "../api/api";
import WorkspaceCard from "../components/WorkspaceCard";

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    fetchWorkspaces();
  }, [workspaces]);

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
      const res = await API.post("/workspaces", { name });
      setWorkspaces((prev) => [res.data, ...prev]);
    } catch (err) {
      alert("Failed to create workspace");
    }
  };

  return (
    <div className="p-8">
      <button
        onClick={createWorkspace}
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Create Workspace
      </button>

      <div className="grid gap-4">
        {workspaces.map((ws) => (
          <WorkspaceCard key={ws.id} workspace={ws} />
        ))}
      </div>
    </div>
  );
}