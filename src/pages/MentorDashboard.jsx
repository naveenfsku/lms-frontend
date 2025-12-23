import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

function MentorDashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  // Assign course
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");

  // Add chapter
  const [chapterCourseId, setChapterCourseId] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");

  // Progress
  const [studentProgress, setStudentProgress] = useState([]);
  const [selectedCourseForProgress, setSelectedCourseForProgress] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load students & courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsRes = await api.get("accounts/students/");
        setStudents(studentsRes.data);

        const coursesRes = await api.get("courses/");
        setCourses(coursesRes.data);
      } catch {
        setError("Failed to load students or courses");
      }
    };

    fetchData();
  }, []);

  // Assign course to student
  const assignCourse = async () => {
    setMessage("");
    setError("");

    if (!studentId || !courseId) {
      setError("Please select both student and course");
      return;
    }

    try {
      await api.post("progress/assign/", {
        student_id: studentId,
        course_id: courseId,
      });

      setMessage("✅ Course assigned successfully");
    } catch {
      setError("❌ Course already assigned or error occurred");
    }
  };

  // Add chapter
  const addChapter = async () => {
    setMessage("");
    setError("");

    if (!chapterCourseId || !chapterTitle.trim()) {
      setError("Please select course and enter chapter title");
      return;
    }

    try {
      await api.post(
        `courses/${chapterCourseId}/chapters/create/`,
        { title: chapterTitle }
      );

      setMessage("✅ Chapter added successfully");
      setChapterTitle("");
    } catch {
      setError("❌ Failed to add chapter");
    }
  };

  // Load student progress for a course
  const loadStudentProgress = async (courseId) => {
    setError("");
    try {
      const res = await api.get(
        `courses/admin/course/${courseId}/students-progress/`
      );
      setStudentProgress(res.data);
      setSelectedCourseForProgress(courseId);
    } catch {
      setError("Failed to load student progress");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-bold mb-6">👨‍🏫 Mentor Dashboard</h2>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* ADD CHAPTER */}
        <div className="bg-white p-6 rounded-xl shadow max-w-xl mb-8">
          <h3 className="text-xl font-semibold mb-4">➕ Add Chapter</h3>

          <select
            className="w-full border p-2 rounded mb-4"
            value={chapterCourseId}
            onChange={(e) => setChapterCourseId(e.target.value)}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Chapter Title"
            className="w-full border p-2 rounded mb-4"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
          />

          <button
            onClick={addChapter}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Add Chapter
          </button>
        </div>

        {/* ASSIGN COURSE */}
        <div className="bg-white p-6 rounded-xl shadow max-w-xl mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Assign Course to Student
          </h3>

          <select
            className="w-full border p-2 rounded mb-4"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.username}
              </option>
            ))}
          </select>

          <select
            className="w-full border p-2 rounded mb-4"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          <button
            onClick={assignCourse}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Assign Course
          </button>
        </div>

        {/* STUDENT PROGRESS */}
        <div className="bg-white p-6 rounded-xl shadow max-w-3xl">
          <h3 className="text-xl font-semibold mb-4">
            📊 Student Progress by Course
          </h3>

          <select
            className="w-full border p-2 rounded mb-4"
            value={selectedCourseForProgress}
            onChange={(e) => loadStudentProgress(e.target.value)}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          {studentProgress.length === 0 && selectedCourseForProgress && (
            <p className="text-gray-500">No progress data available</p>
          )}

          {studentProgress.length > 0 && (
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Student</th>
                  <th className="border p-2">Progress</th>
                </tr>
              </thead>
              <tbody>
                {studentProgress.map((s) => (
                  <tr key={s.student_id}>
                    <td className="border p-2">{s.student_name}</td>
                    <td className="border p-2">
                      {s.percentage}%
                      <div className="w-full bg-gray-200 h-2 rounded mt-1">
                        <div
                          className="bg-green-600 h-2 rounded"
                          style={{ width: `${s.percentage}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default MentorDashboard;
