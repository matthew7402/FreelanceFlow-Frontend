import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white p-4 rounded shadow hover:shadow-lg relative"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      {/* ACTION BUTTONS */}
      <div
        className="absolute top-2 right-2 flex gap-2"
        onClick={(e) => e.stopPropagation()} // prevent navigation
      >
        <button
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-700"
          title="Edit"
        >
          ✏️
        </button>

        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
          title="Delete"
        >
          🗑️
        </button>
      </div>

      {/* CONTENT */}
      <h2 className="text-xl font-bold">{project.name}</h2>
      <p className="text-gray-500">{project.description}</p>
      <p className="text-sm text-blue-500">{project.status}</p>
    </div>
  );
}