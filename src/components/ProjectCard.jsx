import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div
      className="card-surface group relative cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      {/* ACTION BUTTONS */}
      <div
        className="absolute right-5 top-5 flex gap-1 rounded-lg border border-slate-100 bg-white p-1 opacity-100 shadow-sm transition sm:opacity-0 sm:group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()} // prevent navigation
      >
        <button
          onClick={onEdit}
          className="rounded-md px-2 py-1 text-sm text-indigo-500 transition hover:bg-indigo-50 hover:text-indigo-700"
          title="Edit"
        >
          ✏️
        </button>

        <button
          onClick={onDelete}
          className="rounded-md px-2 py-1 text-sm text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
          title="Delete"
        >
          🗑️
        </button>
      </div>

      {/* CONTENT */}
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">◈</div>
      <h2 className="display-font pr-16 text-xl font-bold text-slate-900">{project.name}</h2>
      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{project.description || "No description added yet."}</p>
      <div className="mt-5 flex items-center justify-between">
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold capitalize text-indigo-700">{project.status || "Planning"}</span>
        <span className="text-sm font-semibold text-slate-400 transition group-hover:text-indigo-600">Open chat →</span>
      </div>
    </div>
  );
}
