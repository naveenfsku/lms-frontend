import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreateCourse from "./pages/AdminCreateCourse";
import AdminCreateMentor from "./pages/AdminCreateMentor";
import AdminCourseChapters from "./pages/AdminCourseChapters";
import StudentCourseDetail from "./pages/StudentCourseDetail";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/course/:courseId"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentCourseDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor"
          element={
            <ProtectedRoute allowedRoles={["MENTOR"]}>
              <MentorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-create-course"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminCreateCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-create-mentor"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminCreateMentor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-course/:courseId/chapters"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminCourseChapters />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
