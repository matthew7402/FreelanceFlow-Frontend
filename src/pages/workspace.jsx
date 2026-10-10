import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import ProjectCard from "../components/ProjectCard";

export default function Workspace() {
  const { id } = useParams(); // workspaceId

  const [projects, setProjects] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  /* =========================
     FETCH PROJECTS
  ========================= */
  const fetchProjects = async () => {
    try {
      const res = await API.get(`/workspaces/${id}/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch projects");
    }
  };

  /* =========================
     CREATE PROJECT
  ========================= */
  const createProject = async () => {
    const name = prompt("Project name");
    if (!name) return;

    const description = prompt("Description (optional)");

    try {
      const res = await API.post(`/workspaces/${id}/projects`, {
        name,
        description,
      });

      setProjects((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create project");
    }
  };

  /* =========================
     UPDATE PROJECT
  ========================= */
  const updateProject = async (project) => {
    const name = prompt("New name", project.name);
    const description = prompt("New description", project.description);
    const status = prompt("New status", project.status);

    try {
      const res = await API.put(
        `/workspaces/${id}/projects/${project.id}`,
        {
          name,
          description,
          status,
        }
      );

      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? res.data : p))
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  /* =========================
     DELETE PROJECT
  ========================= */
  const deleteProject = async (projectId) => {
    const confirmDelete = window.confirm("Delete this project?");
    if (!confirmDelete) return;

    try {
      await API.delete(
        `/workspaces/${id}/projects/${projectId}`
      );

      setProjects((prev) =>
        prev.filter((p) => p.id !== projectId)
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

   /* =========================
     INVITE MEMBER
  ========================= */
   const handleInvite = async () => {
    if (!inviteEmail) {
      setInviteMessage("Please enter an email");
      return;
    }

    try {
      const res = await API.post(`/workspaces/${id}/invite`, {
        email: inviteEmail,
      });

      setInviteMessage(res.data.message);
      setInviteEmail(""); // clear input
    } catch (err) {
      console.error(err);
      setInviteMessage(
        err.response?.data?.error || "Failed to invite user"
      );
    }
  };


  return (
    <div className="page-glow min-h-full px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[.18em] text-indigo-600">Workspace</p>
          <h1 className="display-font text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Projects in motion.</h1>
          <p className="mt-2 text-slate-500">Keep client work moving with clear conversations and simple collaboration.</p>
        </div>
        <button onClick={createProject} className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700">+ New project</button>
      </div>
      {/* =========================
          INVITE MEMBER SECTION
      ========================= */}
      <div className="card-surface mb-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-50 text-teal-600">+</span><div><h2 className="display-font text-lg font-bold text-slate-900">Invite a collaborator</h2><p className="text-sm text-slate-500">Add a teammate to this workspace.</p></div></div>

        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter user email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />

          <button
            onClick={handleInvite}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-600"
          >
            Invite
          </button>
        </div>

        {inviteMessage && (
          <p className="mt-3 text-sm font-medium text-slate-600">{inviteMessage}</p>
        )}
      </div>

      <div className="mb-5 flex items-center gap-3"><span className="rounded-lg bg-white px-3 py-1.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200">{projects.length} project{projects.length === 1 ? "" : "s"}</span><span className="text-sm text-slate-500">Click a project to open its chat.</span></div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.length === 0 ? (
          <div className="card-surface col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center"><div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-2xl">◈</div><h2 className="display-font text-xl font-bold text-slate-800">Your project board is clear</h2><p className="mt-2 text-slate-500">Create a project to start collaborating.</p></div>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => updateProject(project)}
              onDelete={() => deleteProject(project.id)}
            />
          ))
        )}
      </div>
      </div>
    </div>
  );
}
