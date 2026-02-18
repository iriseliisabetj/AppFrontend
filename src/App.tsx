import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import "./styles/app.css";
import ForumPage from "./pages/ForumPage";
import QuizTodayPage from "./pages/QuizPage";
import AdminViewQuizPage from "./pages/admin/AdminViewQuizPage";
import AdminCreateQuizPage from "./pages/admin/AdminCreateQuizPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/forum" element={<ForumPage />} />
      <Route path="/quiz/today" element={<QuizTodayPage />} />
      <Route path="/admin/quizzes" element={<AdminViewQuizPage />} />
      <Route path="/admin/quizzes/new" element={<AdminCreateQuizPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}