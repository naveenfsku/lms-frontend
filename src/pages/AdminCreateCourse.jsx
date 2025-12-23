import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

function AdminCreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mentor, setMentor] = useState("");
  const [mentors, setMentors] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    api.get("accounts/mentors/")
      .then(res => setMentors(res.data))
      .catch(() => setError("Failed to load mentors"));
  }, []);

  const createCourse = async () => {
    setError("");

    if (!title || !description || !mentor) {
      setError("All fields are required");
      return;
    }

    try {
      await api.post("courses/admin/create/", {
        title,
        description,
        mentor,
      });

      alert("✅ Course created successfully");
      navigate("/admin-dashboard");

    } catch (err) {
      console.error(err);
      setError("Failed to create course");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-xl shadow max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4">➕ Create Course</h2>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <input
            className="w-full border p-2 rounded mb-4"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full border p-2 rounded mb-4"
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="w-full border p-2 rounded mb-4"
            value={mentor}
            onChange={(e) => setMentor(e.target.value)}
          >
            <option value="">Select Mentor</option>
            {mentors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.username}
              </option>
            ))}
          </select>

          <button
            onClick={createCourse}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Create Course
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminCreateCourse;
