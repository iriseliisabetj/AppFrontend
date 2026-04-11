import { useEffect, useMemo, useState } from "react";
import { createForumPost } from "../../api/forum";
import { getErrorMessage } from "./forumHelpers";

type CreatePostModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => Promise<void>;
};

export function CreatePostModal({
  open,
  onClose,
  onCreated,
}: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const imagePreviewUrl = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setBody("");
      setIsAnonymous(false);
      setImageFile(null);
      setSubmitting(false);
    }
  }, [open]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim() || submitting) return;

    setSubmitting(true);

    try {
      await createForumPost({
        title,
        body,
        isAnonymous,
        imageFile,
      });

      await onCreated();
      onClose();
    } catch (e: unknown) {
      alert(getErrorMessage(e, "Postituse loomine ebaõnnestus"));
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalCard modalCard--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modalCard__top">
          <h2 className="card__title">Lisa postitus</h2>
          <button className="btn btn--ghost" type="button" onClick={onClose}>
            Sule
          </button>
        </div>

        <form className="form" onSubmit={onSubmit}>
          <label className="field">
            <span className="label">Pealkiri</span>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="label">Sisu</span>
            <textarea
              className="input"
              style={{ minHeight: 140 }}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Kirjelda, mis juhtus..."
            />
          </label>

          <label className="field">
            <span className="label">Pilt</span>
            <input
              className="input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {imagePreviewUrl && (
            <div className="forumUploadPreview">
              <img
                src={imagePreviewUrl}
                alt="Valitud pildi eelvaade"
                className="forumUploadPreview__img"
              />
            </div>
          )}

          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <span>Postita anonüümselt</span>
          </label>

          <div className="row" style={{ justifyContent: "space-between" }}>
            <button className="btn btn--ghost" type="button" onClick={onClose}>
              Tühista
            </button>

            <button
              className="btn btn--primary"
              type="submit"
              disabled={!title.trim() || !body.trim() || submitting}
            >
              {submitting ? "Lisan..." : "Lisa postitus"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}