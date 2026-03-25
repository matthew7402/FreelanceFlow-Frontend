import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function WorkspaceCard({ workspace }) {
  const navigate = useNavigate();
console.log(
    "WorkspaceCard - role:", workspace?.role,
    "status:", workspace?.subscription_status,
    "length:", workspace?.subscription_status?.length
  );
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
      className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg relative"
      onClick={() => navigate(`/workspace/${workspace.id}`)}
    >
      <h2 className="text-xl font-bold">{workspace.name}</h2>
      <p className="text-gray-500">Role: {workspace.role}</p>

      {/* ACTIVATE BUTTON: only for owners */}
     {workspace.role === "owner" && workspace.subscription_status === "inactive" && (
        <button
          onClick={handleSubscribe}
          className="absolute top-2 right-2 bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
        >
          Activate
        </button>
      )}

      {workspace.subscription_status === "active" && (
        <span className="absolute top-2 right-2 text-green-600 text-sm font-semibold">
          Active
        </span>
      )}
    </div>
  );
}