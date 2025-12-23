import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loadStudentProgress = async (courseId) => {
    try {
      const res = await api.get(
        `courses/admin/course/${courseId}/students-progress/`
      );
      setStudentProgress(res.data);
      setSelectedCourse(courseId);
    } catch {
      setError("Failed to load student progress");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await api.get("accounts/admin/users/");
        setUsers(usersRes.data);

        const coursesRes = await api.get("courses/admin/");
        setCourses(coursesRes.data);
      } catch {
        setError("Failed to load admin data");
      }
    };

    fetchData();
  }, []);

  const deleteUser = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`accounts/admin/users/${userId}/delete/`);
    setUsers(users.filter((u) => u.id !== userId));
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm("Delete this course?")) return;
    await api.delete(`courses/admin/${courseId}/delete/`);
    setCourses(courses.filter((c) => c.id !== courseId));
    setStudentProgress([]);
    setSelectedCourse(null);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">
          🛡️ Admin Dashboard
        </h2>

        {error && (
          <p className="text-red-600 mb-4 text-center">{error}</p>
        )}

        {/* USER MANAGEMENT */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <h3 className="text-xl font-semibold mb-4 text-center">
            👤 User Management
          </h3>

          <table className="w-full border text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-3">Username</th>
                <th className="border p-3">Role</th>
                <th className="border p-3">Active</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="border p-3">{user.username}</td>
                  <td className="border p-3 font-medium">{user.role}</td>
                  <td className="border p-3">
                    {user.is_active ? "✅ Yes" : "❌ No"}
                  </td>
                  <td className="border p-3">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* COURSE MANAGEMENT */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <h3 className="text-xl font-semibold mb-4 text-center">
            📚 Course Management
          </h3>

          <div className="flex justify-center mb-4">
            <button
              onClick={() => navigate("/admin-create-course")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              + Add Course
            </button>
          </div>

          <table className="w-full border text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-3">Course Title</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr
                  key={course.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="border p-3 font-medium">
                    {course.title}
                  </td>
                  <td className="border p-3 space-x-4">
                    <button
                      onClick={() =>
                        navigate(`/admin-course/${course.id}/chapters`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Manage
                    </button>
                    <button
                      onClick={() => loadStudentProgress(course.id)}
                      className="text-green-600 hover:underline"
                    >
                      Progress
                    </button>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* STUDENT PROGRESS */}
        {selectedCourse && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">
              📊 Student Progress
            </h3>

            <table className="w-full border text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-3">Student</th>
                  <th className="border p-3">Progress</th>
                </tr>
              </thead>
              <tbody>
                {studentProgress.map((s, index) => (
                  <tr
                    key={s.student_id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="border p-3 font-medium">
                      {s.student_name}
                    </td>
                    <td className="border p-3">
                      <span className="font-semibold">
                        {s.percentage}%
                      </span>
                      <div className="w-full bg-gray-200 h-3 rounded-full mt-2">
                        <div
                          className="bg-green-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${s.percentage}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminDashboard;
