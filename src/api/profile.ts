import { api } from "./client";
import type { MyProfileDto, ProfileBadgeDto } from "../types/profile";

export async function fetchMyProfile() {
  const res = await api.get<MyProfileDto>("/profile/me");
  return res.data;
}

export async function fetchMyBadges() {
  const res = await api.get<ProfileBadgeDto[]>("/profile/badges");
  return res.data;
}
