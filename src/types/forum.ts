export type ForumPost = {
  id: string;
  title: string;
  body: string;
  isAnonymous: boolean;
  createdAtUtc?: string;
  authorDisplayName?: string;
  imagePath?: string | null;
  canDelete: boolean;
};

export type CreateForumPostInput = {
  title: string;
  body: string;
  isAnonymous: boolean;
  imageFile?: File | null;
};