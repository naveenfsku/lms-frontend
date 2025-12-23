import { useState , useCallback} from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

function AdminCourseChapters() {
  const { courseId } = useParams();

  const [chapters, setChapters] = useState([]);
  const [chapterTitle, setChapterTitle] = useState("");
  const [lessonData, setLessonData] = useState({});
  const [error, setError] = useState("");

  
  const fetchChapters = useCallback(async () => {
  try {
    const res = await api.get(
      `courses/admin/${courseId}/chapters/`
    );
    setChapters(res.data);
  } catch {
    setError("Failed to load chapters");
  }
}, [courseId]);

  
  const addChapter = async () => {
    if (!chapterTitle.trim()) return;

    try {
      await api.post(
        `courses/admin/${courseId}/chapters/`,
        { title: chapterTitle }
      );
      setChapterTitle("");
      fetchChapters();
    } catch {
      setError("Failed to add chapter");
    }
  };

  // 🔹 Delete Chapter
  const deleteChapter = async (id) => {
    if (!window.confirm("Delete this chapter?")) return;

    try {
      await api.delete(
        `courses/admin/chapters/${id}/delete/`
      );
      setChapters(prev => prev.filter(ch => ch.id !== id));
    } catch {
      setError("Failed to delete chapter");
    }
  };

  // 🔹 Save Lesson (ACTUAL SAVE)
  const addLesson = async (chapterId) => {
    const lesson = lessonData[chapterId];

    if (!lesson?.title?.trim()) {
      alert("Lesson title is required");
      return;
    }

    try {
      await api.post(
        `courses/lessons/chapter/${chapterId}/create/`,
        {
          title: lesson.title,
          content: lesson.content || "",
          video_url: lesson.video || ""
        }
      );

      alert("Lesson saved successfully ✅");

      // Clear inputs
      setLessonData(prev => ({
        ...prev,
        [chapterId]: { title: "", content: "", video: "" }
      }));

      // 🔥 Refresh chapters so lesson appears for students
      fetchChapters();
    } catch {
      alert("Failed to save lesson ❌");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-4">
          📘 Manage Chapters & Lessons
        </h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        {/* 🔹 Add Chapter */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="New Chapter Title"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
          />

          <button
            onClick={addChapter}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Chapter
          </button>
        </div>

        {/* 🔹 Chapters List */}
        <ul className="space-y-4">
          {chapters.map((ch) => (
            <li key={ch.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg">{ch.title}</h3>

                <button
                  onClick={() => deleteChapter(ch.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete Chapter
                </button>
              </div>

              {/* 🔹 Add / Save Lesson */}
              <div className="space-y-2">
                <input
                  placeholder="Lesson Title"
                  className="border p-2 w-full rounded"
                  value={lessonData[ch.id]?.title || ""}
                  onChange={(e) =>
                    setLessonData(prev => ({
                      ...prev,
                      [ch.id]: {
                        ...prev[ch.id],
                        title: e.target.value
                      }
                    }))
                  }
                />

                <textarea
                  placeholder="Lesson Content"
                  className="border p-2 w-full rounded"
                  value={lessonData[ch.id]?.content || ""}
                  onChange={(e) =>
                    setLessonData(prev => ({
                      ...prev,
                      [ch.id]: {
                        ...prev[ch.id],
                        content: e.target.value
                      }
                    }))
                  }
                />

                <input
                  placeholder="Video URL (optional)"
                  className="border p-2 w-full rounded"
                  value={lessonData[ch.id]?.video || ""}
                  onChange={(e) =>
                    setLessonData(prev => ({
                      ...prev,
                      [ch.id]: {
                        ...prev[ch.id],
                        video: e.target.value
                      }
                    }))
                  }
                />

                <button
                  onClick={() => addLesson(ch.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save Lesson
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default AdminCourseChapters;
