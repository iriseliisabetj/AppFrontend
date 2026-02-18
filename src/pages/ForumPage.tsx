import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { PrimaryLinkButton, SecondaryLinkButton } from "../components/ui/Buttons";

type ForumPost = {
  id: string;
  title: string;
  body: string;
  isAnonymous: boolean;
  createdAtUtc?: string;
  authorDisplayName?: string;
};

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem("access_token"));

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/posts", {
        params: { page: 1, pageSize: 50 },
      });

      const data = res.data;

      const list: ForumPost[] =
        Array.isArray(data)
          ? data
          : data?.items ?? data?.entries ?? data?.posts ?? [];

      const sorted = [...list].sort((a, b) =>
        (b.createdAtUtc ?? "").localeCompare(a.createdAtUtc ?? "")
      );

      setPosts(sorted);
    } catch (e: any) {
      setError(
        e?.response?.data?.title ??
          e?.response?.data?.message ??
          e?.message ??
          "Postituste laadimine ebaõnnestus"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim() || submitting) return;

    setSubmitting(true);
    try {
      await api.post("/posts", {
        title,
        body,
        isAnonymous,
      });

      setTitle("");
      setBody("");
      setIsAnonymous(false);

      await load();
    } catch (e: any) {
      alert(
        e?.response?.data?.title ??
          e?.response?.data?.message ??
          "Postituse loomine ebaõnnestus"
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Kas oled kindel, et soovid postituse kustutada?"))
      return;

    try {
      await api.delete(`/posts/${id}`);
      await load();
    } catch (e: any) {
      alert(
        e?.response?.data?.title ??
          e?.response?.data?.message ??
          "Kustutamine ebaõnnestus"
      );
    }
  }

  return (
    <div className="page">
      <div className="container">
        <header className="topbar">
          <Link className="brand" to="/">
            <span className="brand__logo" />
            <span>
              <div className="brand__title">Foorum</div>
              <div className="brand__subtitle">
                Jaga oma kogemust andmepüügiga
              </div>
            </span>
          </Link>

          <Link className="btn btn--ghost" to="/">
            ← Avaleht
          </Link>
        </header>

        {isLoggedIn && (
          <div className="card" style={{ marginBottom: 18 }}>
            <h2 className="card__title">Lisa postitus</h2>

            <form className="form" onSubmit={onSubmit}>
              <label className="field">
                <span className="label">Pealkiri</span>
                <input
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nt Kuidas peaaegu klikisin valele lingile"
                />
              </label>

              <label className="field">
                <span className="label">Sisu</span>
                <textarea
                  className="input"
                  style={{ minHeight: 100 }}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Kirjelda, mis juhtus ja mida sa õppisid..."
                />
              </label>

              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <span>Postita anonüümselt</span>
              </label>

              <button
                className="btn btn--primary"
                type="submit"
                disabled={!title.trim() || !body.trim() || submitting}
              >
                {submitting ? "Lisan..." : "Lisa postitus"}
              </button>
            </form>
          </div>
        )}

        {!isLoggedIn && (
          <div className="alert alert--info">
            Postitamiseks pead olema sisse logitud.
            {isLoggedIn ? (
              <PrimaryLinkButton to="/quiz/today">Mine tänasele viktoriinile</PrimaryLinkButton>
            ) : (
              <>
                <PrimaryLinkButton to="/auth/register">Loo konto</PrimaryLinkButton>
                <SecondaryLinkButton to="/auth/login">Logi sisse</SecondaryLinkButton>
              </>
            )}
          </div>
        )}

        <div className="card">
          <h2 className="card__title">Postitused</h2>

          {loading && <div className="help">Laen postitusi…</div>}
          {error && <div className="alert alert--error">{error}</div>}

          {!loading && posts.length === 0 && (
            <div className="help">Foorumis pole veel postitusi.</div>
          )}

          <div className="grid" style={{ marginTop: 14 }}>
            {posts.map((p) => (
              <div key={p.id} className="forumCard">
                <div className="forumCard__top">
                  <span className="badge">
                    {p.isAnonymous ? "Anonüümne" : p.authorDisplayName ?? "Kasutaja"} 
                  </span>
                  <span className="forumCard__title">{p.title}</span>
                </div>

                <div className="forumCard__body">{p.body}</div>

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
                    {p.createdAtUtc
                      ? new Date(p.createdAtUtc).toLocaleString()
                      : ""}
                  </div>

                  {isLoggedIn && (
                    <button
                      className="btn btn--ghost"
                      onClick={() => onDelete(p.id)}
                    >
                      Kustuta
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
