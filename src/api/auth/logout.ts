import { api } from "../client";

export async function logout() {
  try {
    await api.post("/auth/logout", {});
  } catch (e) {
    console.error("Logout error:", e);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}