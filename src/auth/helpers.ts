export function isAdminFromToken(): boolean {
  const t = localStorage.getItem("access_token");
  if (!t) return false;
  try {
    const payload = JSON.parse(atob(t.split(".")[1]));
    const roles = payload?.role ?? payload?.roles ?? payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (Array.isArray(roles)) return roles.includes("admin") || roles.includes("Admin");
    return roles === "admin" || roles === "Admin";
  } catch {
    return false;
  }
}
