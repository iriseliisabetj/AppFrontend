import { api } from "./client";
import type { MyProfileDto } from "../types/profile";

export async function fetchMyProfile() {
  const res = await api.get<MyProfileDto>("/profile/me");
  return res.data;
}
