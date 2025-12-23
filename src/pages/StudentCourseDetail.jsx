import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

function StudentCourseDetail() {
  const { courseId } = useParams();

  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [activeChapter, setActiveChapter] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  // 🔹 Load chapters for this course
  useEffect(() => {
    api
      .get(`courses/student/${courseId}/chapters/`)
      .then((res) => setChapters(res.data))
      .catch((err) => console.error("Failed to load chapters", err));
  }, [courseId]);

  // 🔹 Load lessons when chapter clicked
  const loadLessons = async (chapterId) => {
    try {
      setActiveChapter(chapterId);
      setLoadingLessons(true);

      const res = await api.get(
        `courses/lessons/chapter/${chapterId}/`
      );

      setLessons(res.data);
    } catch (err) {
      console.error("Failed to load lessons", err);
      setLessons([]);
    } finally {
      setLoadingLessons(false);
    }
  };

  // 🔹 Mark lesson completed
  const markCompleted = async (lessonId) => {
    try {
      await api.post(`progress/lesson/${lessonId}/complete/`);
      setCompletedLessons((prev) => [...prev, lessonId]);
    } catch (err) {
      alert("Lesson already completed or error occurred" , err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chapters */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-bold mb-4 text-lg">📘 Chapters</h3>

          {chapters.length === 0 && (
            <p className="text-gray-500">No chapters added yet</p>
          )}

          {chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => loadLessons(ch.id)}
              className={`block w-full text-left p-2 mb-2 rounded border
                ${
                  activeChapter === ch.id
                    ? "bg-blue-100 border-blue-500 font-semibold"
                    : "hover:bg-gray-100"
                }
              `}
            >
              {ch.title}
            </button>
          ))}
        </div>

        {/* Lessons */}
        <div className="md:col-span-2 bg-white p-4 rounded-xl shadow">
          <h3 className="font-bold mb-4 text-lg">📗 Lessons</h3>

          {!activeChapter && (
            <p className="text-gray-500">
              Select a chapter to view lessons
            </p>
          )}

          {loadingLessons && (
            <p className="text-gray-500">Loading lessons...</p>
          )}

          {activeChapter && !loadingLessons && lessons.length === 0 && (
            <p className="text-gray-500">
              No lessons added for this chapter yet
            </p>
          )}

          {lessons.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className="border p-3 rounded mb-3 flex justify-between items-center"
              >
                <span className="font-medium">{lesson.title}</span>

                <button
                  disabled={isCompleted}
                  onClick={() => markCompleted(lesson.id)}
                  className={`px-3 py-1 rounded text-white
                    ${
                      isCompleted
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }
                  `}
                >
                  {isCompleted ? "Completed ✓" : "Mark Completed"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default StudentCourseDetail;
