import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <div className="page-glow grid min-h-full place-items-center px-5 py-12 text-center">
      <div className="card-surface max-w-md rounded-3xl border border-white bg-white p-10"><div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-amber-100 text-3xl text-amber-600">!</div><h1 className="display-font text-2xl font-extrabold text-slate-900">Payment cancelled</h1><p className="mt-3 text-slate-500">No changes were made. You can return whenever you are ready.</p><Link to="/dashboard" className="mt-7 inline-block rounded-xl bg-slate-900 px-5 py-3 font-bold text-white transition hover:bg-indigo-600">Back to dashboard</Link></div>
    </div>
  );
}
