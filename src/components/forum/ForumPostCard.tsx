import { toMediaUrl } from "../../utils/media";
import type { ForumPost } from "../../types/forum";
import {
  clipForumText,
  formatForumDate,
  getForumAuthorLabel,
} from "./forumHelpers";

type ForumPostCardProps = {
  post: ForumPost;
  canDelete: boolean;
  onOpen: (post: ForumPost) => void;
  onDelete: (id: string) => Promise<void>;
};

export function ForumPostCard({
  post,
  canDelete,
  onOpen,
  onDelete,
}: ForumPostCardProps) {
  return (
    <button
      type="button"
      className="forumCard forumCard--button"
      onClick={() => onOpen(post)}
    >
      <div className="forumCard__top">
        <span className="badge">
          {getForumAuthorLabel(post.isAnonymous, post.authorDisplayName)}
        </span>
        <span className="forumCard__title">{post.title}</span>
      </div>

      <div className="forumCard__body">{clipForumText(post.body)}</div>

      {post.imagePath && (
        <div className="forumPostImageWrap">
          <img
            src={toMediaUrl(post.imagePath)}
            alt="Postitusega seotud pilt"
            className="forumPostImage"
          />
        </div>
      )}

      <div
        style={{
          marginTop: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div className="help" style={{ fontSize: 12 }}>
          {formatForumDate(post.createdAtUtc)}
        </div>

        {canDelete && (
          <button
            className="btn btn--ghost"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void onDelete(post.id);
            }}
          >
            Kustuta
          </button>
        )}
      </div>
    </button>
  );
}