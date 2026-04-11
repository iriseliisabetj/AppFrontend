import { api } from "./client";
import type { CreateForumPostInput, ForumPost } from "../types/forum";

function extractForumPosts(data: unknown): ForumPost[] {
  if (Array.isArray(data)) {
    return data as ForumPost[];
  }

  const obj = data as {
    items?: ForumPost[];
    entries?: ForumPost[];
    posts?: ForumPost[];
  } | null;

  return obj?.items ?? obj?.entries ?? obj?.posts ?? [];
}

export async function fetchForumPosts(): Promise<ForumPost[]> {
  const res = await api.get("/posts", {
    params: { page: 1, pageSize: 50 },
  });

  const posts = extractForumPosts(res.data);

  return [...posts].sort((a, b) =>
    (b.createdAtUtc ?? "").localeCompare(a.createdAtUtc ?? "")
  );
}

export async function createForumPost(input: CreateForumPostInput): Promise<void> {
  const formData = new FormData();
  formData.append("Title", input.title.trim());
  formData.append("Body", input.body.trim());
  formData.append("IsAnonymous", String(input.isAnonymous));

  if (input.imageFile) {
    formData.append("Image", input.imageFile);
  }

  await api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteForumPost(id: string): Promise<void> {
  await api.delete(`/posts/${id}`);
}