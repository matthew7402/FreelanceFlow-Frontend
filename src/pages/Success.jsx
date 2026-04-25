import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/api";

export default function Success() {
  const [params] = useSearchParams();

  useEffect(() => {
    const sessionId = params.get("session_id");

    if (sessionId) {
      activateSubscription(sessionId);
    }
  }, []);

  const activateSubscription = async (sessionId) => {
    try {
      await API.get(`/stripe-success?session_id=${sessionId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-green-600">
        Subscription Activated 🎉
      </h1>
      <p className="mt-4">You can now create projects.</p>
    </div>
  );
}