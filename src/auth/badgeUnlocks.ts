import type { ProfileBadgeDto } from "../types/profile";

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;

    const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const json = atob(padded);

    const parsed: unknown = JSON.parse(json);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }

    return null;
  } catch {
    return null;
  }
}

function currentUserKey() {
  const token = localStorage.getItem("access_token");
  if (!token) return "anonymous";

  const payload = parseJwtPayload(token);

  const candidates = [
    payload?.sub,
    payload?.nameid,
    payload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
    payload?.unique_name,
    payload?.username,
    payload?.email,
  ];

  for (const c of candidates) {
    if (typeof c === "string" && c.trim().length > 0) {
      return c;
    }
  }

  return "anonymous";
}

function storageKey() {
  return `seen_badges:${currentUserKey()}`;
}

function badgeKey(b: ProfileBadgeDto) {
  return `${b.badgeId}|${b.awardedAt ?? "none"}`;
}

function readSeenBadgeKeys(): string[] {
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === "string");
    }
    return [];
  } catch {
    return [];
  }
}

function writeSeenBadgeKeys(keys: string[]) {
  localStorage.setItem(storageKey(), JSON.stringify(keys));
}

export function getUnseenBadges(badges: ProfileBadgeDto[]) {
  const seen = new Set(readSeenBadgeKeys());

  return [...badges]
    .filter((b) => b.isUnlocked && b.awardedAt !== null)
    .sort(
      (a, b) =>
        new Date(b.awardedAt ?? 0).getTime() - new Date(a.awardedAt ?? 0).getTime()
    )
    .filter((b) => !seen.has(badgeKey(b)));
}

export function markBadgeSeen(badge: ProfileBadgeDto) {
  const seen = new Set(readSeenBadgeKeys());
  seen.add(badgeKey(badge));
  writeSeenBadgeKeys([...seen]);
}