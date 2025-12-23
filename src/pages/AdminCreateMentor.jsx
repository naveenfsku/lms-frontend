import { useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function AdminCreateMentor() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const createMentor = async () => {
    setMessage("");
    setError("");

    try {
      await api.post("accounts/admin/create-mentor/", {
        username,
        password,
      });

      setMessage("✅ Mentor created successfully");
      setUsername("");
      setPassword("");
    } catch (err) {
      setError("❌ Failed to create mentor" , err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-6">👨‍🏫 Create Mentor</h2>

        <div className="bg-white p-6 rounded-xl shadow max-w-md">
          {message && <p className="text-green-600 mb-3">{message}</p>}
          {error && <p className="text-red-600 mb-3">{error}</p>}

          <input
            className="w-full border p-2 rounded mb-3"
            placeholder="Mentor Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full border p-2 rounded mb-4"
            placeholder="Temporary Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={createMentor}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Create Mentor
          </button>

          <button
            onClick={() => navigate("/admin-dashboard")}
            className="w-full mt-3 text-gray-600 underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminCreateMentor;
