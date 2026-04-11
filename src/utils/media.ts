export function toMediaUrl(path?: string | null) {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const mediaBase = import.meta.env.VITE_MEDIA_BASE_URL ?? "http://localhost:5229";
  return `${mediaBase}${path}`;
}