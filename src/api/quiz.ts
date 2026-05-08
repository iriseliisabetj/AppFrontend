import { api } from "./client";
import type { ApiQuizAnswerRequest, ApiQuizAnswerResponse, ApiTodayQuiz } from "../types/quiz";

export async function getTodaysQuiz() {
  const res = await api.get<ApiTodayQuiz>("/quiz/today");
  return res.data;
}

export async function answerTodaysQuiz(payload: ApiQuizAnswerRequest) {
  const res = await api.post<ApiQuizAnswerResponse>("/quiz/answer", payload);
  return res.data;
}

export async function getLeaderboard(limit = 100) {
  const res = await api.get("/quiz/leaderboard", { params: { limit } });
  return res.data;
}