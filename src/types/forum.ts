export type ForumPost = {
  id: string;
  title: string;
  body: string;
  isAnonymous: boolean;
  createdAtUtc?: string;
  authorDisplayName?: string;
  imagePath?: string | null;
};

export type CreateForumPostInput = {
  title: string;
  body: string;
  isAnonymous: boolean;
  imageFile?: File | null;
};