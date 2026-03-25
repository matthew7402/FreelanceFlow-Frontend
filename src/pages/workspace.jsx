import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import ProjectCard from "../components/ProjectCard";

export default function Workspace() {
  const { id } = useParams(); // workspaceId

  const [projects, setProjects] = useState([]);

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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Workspace Projects</h1>

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