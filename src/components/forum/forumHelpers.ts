export function clipForumText(text: string, max = 220) {
  const normalized = (text ?? "").trim().replace(/\s+/g, " ");
  if (normalized.length <= max) return normalized;
  return normalized.slice(0, max - 1) + "…";
}

export function formatForumDate(value?: string) {
  return value ? new Date(value).toLocaleString() : "";
}

export function getForumAuthorLabel(isAnonymous: boolean, authorDisplayName?: string) {
  return isAnonymous ? "Anonüümne" : authorDisplayName ?? "Kasutaja";
}

export function getErrorMessage(e: unknown, fallback: string) {
  const ex = e as {
    response?: { data?: { title?: string; message?: string } };
    message?: string;
  };

  return (
    ex?.response?.data?.title ??
    ex?.response?.data?.message ??
    ex?.message ??
    fallback
  );
}