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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Workspace Projects</h1>
      {/* =========================
          INVITE MEMBER SECTION
      ========================= */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Invite Member</h2>

        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter user email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />

          <button
            onClick={handleInvite}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Invite
          </button>
        </div>

        {inviteMessage && (
          <p className="mt-2 text-sm text-gray-700">{inviteMessage}</p>
        )}
      </div>

      <button
        onClick={createProject}
        className="mb-6 bg-green-500 text-white px-4 py-2 rounded"
      >
        + Create Project
      </button>

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <p>No projects yet</p>
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
  );
}