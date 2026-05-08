import { toMediaUrl } from "../../utils/media";
import type { ForumPost } from "../../types/forum";
import { formatForumDate, getForumAuthorLabel } from "./forumHelpers";

type PostDetailsModalProps = {
  post: ForumPost | null;
  canDelete: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
};

export function PostDetailsModal({
  post,
  canDelete,
  onClose,
  onDelete,
}: PostDetailsModalProps) {
  if (!post) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalCard modalCard--post" onClick={(e) => e.stopPropagation()}>
        <div className="modalCard__top">
          <div>
            <div className="forumCard__top">
              <span className="badge">
                {getForumAuthorLabel(post.isAnonymous, post.authorDisplayName)}
              </span>
              <span className="forumCard__title">{post.title}</span>
            </div>

            <div className="help" style={{ marginTop: 8 }}>
              {formatForumDate(post.createdAtUtc)}
            </div>
          </div>
        </div>

        <div className="forumPostModal__body">
          <div className="forumPostModal__text">{post.body}</div>

          {post.imagePath && (
            <div className="forumPostModal__imageWrap">
              <img
                src={toMediaUrl(post.imagePath)}
                alt="Postitusega seotud pilt"
                className="forumPostModal__image"
              />
            </div>
          )}
        </div>

        <div className="row" style={{ justifyContent: "space-between", marginTop: 18 }}>
          <button className="btn btn--ghost" type="button" onClick={onClose}>
            Sulge vaade
          </button>

          {canDelete && (
            <button
              className="btn btn--ghost"
              type="button"
              onClick={async () => {
                await onDelete(post.id);
                onClose();
              }}
            >
              Kustuta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}