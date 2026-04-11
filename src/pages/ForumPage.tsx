import { useEffect, useState } from "react";
import { PageLayout } from "../components/layout/PageLayout";
import { fetchForumPosts, deleteForumPost } from "../api/forum";
import type { ForumPost } from "../types/forum";
import { getErrorMessage } from "../components/forum/forumHelpers";
import { CreatePostModal } from "../components/forum/CreatePostModal";
import { PostDetailsModal } from "../components/forum/PostDetailsModal";
import { ForumPostCard } from "../components/forum/ForumPostCard";

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);

  const isLoggedIn = Boolean(localStorage.getItem("access_token"));

  async function loadPosts() {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchForumPosts();
      setPosts(data);
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Postituste laadimine ebaõnnestus"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm("Kas oled kindel, et soovid postituse kustutada?")) {
      return;
    }

    try {
      await deleteForumPost(id);
      await loadPosts();
    } catch (e: unknown) {
      alert(getErrorMessage(e, "Kustutamine ebaõnnestus"));
    }
  }

  return (
    <PageLayout>
      <section style={{ marginBottom: 18 }}>
        <div className="forumTopBar">
          <div>
            <h1 style={{ margin: 0 }}>Foorum</h1>
            <div className="help" style={{ marginTop: 6 }}>
              Loe teiste kasutajate postitusi ning <b>logi sisse</b>, et jagada oma kogemusi õngitsustega.
            </div>
          </div>

          {isLoggedIn ? (
            <button
              className="btn btn--primary"
              type="button"
              onClick={() => setIsCreateOpen(true)}
            >
              Lisa postitus
            </button>
          ) : null}
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">Postitused</h2>

        {loading && <div className="help">Laen postitusi…</div>}
        {error && <div className="alert alert--error">{error}</div>}

        {!loading && posts.length === 0 && (
          <div className="help">Foorumis pole veel postitusi.</div>
        )}

        <div className="grid" style={{ marginTop: 14 }}>
          {posts.map((post) => (
            <ForumPostCard
              key={post.id}
              post={post}
              isLoggedIn={isLoggedIn}
              onOpen={setSelectedPost}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>

      <CreatePostModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={loadPosts}
      />

      <PostDetailsModal
        post={selectedPost}
        isLoggedIn={isLoggedIn}
        onClose={() => setSelectedPost(null)}
        onDelete={handleDelete}
      />
    </PageLayout>
  );
}