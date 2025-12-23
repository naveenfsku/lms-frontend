import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("courses/my-courses/");
        setCourses(res.data);

        const progressData = {};
        for (let course of res.data) {
          try {
            const p = await api.get(
              `courses/student/${course.id}/progress/`
            );
            progressData[course.id] = p.data.percentage;
          } catch {
            progressData[course.id] = 0;
          }
        }

        setProgress(progressData);
      } catch {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const downloadCertificate = async (courseId) => {
  try {
    const res = await api.post(
      `certificates/generate/${courseId}/`
    );

    const certificateId = res.data.certificate_id;

    const fileRes = await api.get(
      `certificates/download/${certificateId}/`,
      { responseType: "blob" } 
    );

    const blob = new Blob([fileRes.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "certificate.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (err) {
    alert("❌ Unable to download certificate");
    console.error(err);
  }
};


  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">
          🎓 Student Dashboard
        </h2>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && courses.length === 0 && (
          <p className="text-gray-600 text-center">
            No courses assigned.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const percentage = progress[course.id] || 0;

            return (
              <div
                key={course.id}
                className="bg-white p-5 rounded-lg shadow"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {course.title}
                </h3>

                <p className="text-sm font-semibold mb-1">
                  Completion: {percentage}%
                </p>

                <div className="w-full bg-gray-200 rounded h-3 mb-4">
                  <div
                    className="bg-green-600 h-3 rounded"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      navigate(`/student/course/${course.id}`)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    View Course
                  </button>

                  <button
                    disabled={percentage !== 100}
                    onClick={() =>
                      downloadCertificate(course.id)
                    }
                    className={`px-4 py-2 rounded text-white
                      ${
                        percentage === 100
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                  >
                    Download Certificate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
