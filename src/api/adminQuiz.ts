import { api } from "./client";
import type { AdminQuizDraft, AdminQuizItemDraft } from "../types/adminQuiz";

export async function fetchAdminQuizItems(date: string) {
  const res = await api.get("/admin/quizzes/items", { params: { date } });
  return res.data;
}

export async function createAdminQuiz(payload: AdminQuizDraft) {
  const res = await api.post("/admin/quizzes", payload);
  return res.data;
}

export async function deleteAdminQuiz(date: string) {
  const res = await api.delete(`/admin/quizzes/${date}`);
  return res.data;
}

export async function updateAdminQuiz(date: string, items: AdminQuizItemDraft[]) {
  const res = await api.put(`/admin/quizzes/${date}`, { items });
  return res.data;
}