import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("STUDENT");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ HANDLE LOGIN (THIS WAS MISSING)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("auth/login/", {
        username,
        password,
      });

      // ✅ STORE TOKENS
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // ✅ DECODE ROLE FROM TOKEN
      const decoded = jwtDecode(response.data.access);
      localStorage.setItem("role", decoded.role);

      // ✅ ROLE-BASED REDIRECT
      if (decoded.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (decoded.role === "MENTOR") {
        navigate("/mentor-dashboard");
      } else {
        navigate("/student-dashboard");
      }

    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  const roleCard = (role, label, icon, activeClasses) => (
    <div
      onClick={() => setSelectedRole(role)}
      className={`cursor-pointer border rounded-xl p-4 flex items-center gap-3
        ${selectedRole === role ? activeClasses : "border-gray-300"}`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-semibold">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          LMS Login
        </h2>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {roleCard("STUDENT", "Student", "🎓", "border-green-600 bg-green-50")}
          {roleCard("MENTOR", "Mentor", "👨‍🏫", "border-blue-600 bg-blue-50")}
          {roleCard("ADMIN", "Admin", "🛡", "border-red-600 bg-red-50")}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          New user?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
