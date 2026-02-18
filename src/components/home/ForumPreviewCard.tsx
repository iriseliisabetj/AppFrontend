import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { CardHeader } from "../ui/CardHeader";
import { PrimaryLinkButton } from "../ui/Buttons";

type ForumPostPreview = {
  id: string;
  title: string;
  body: string;
  isAnonymous: boolean;
  authorDisplayName?: string;
};

function clip(text: string, max = 170) {
  const t = (text ?? "").trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + "…";
}

function getErrMsg(e: unknown) {
  const ex = e as { message?: string; response?: { data?: { title?: string; message?: string } } };
  return (
    ex?.response?.data?.title ??
    ex?.response?.data?.message ??
    ex?.message ??
    "Foorumi postitusi ei saanud laadida"
  );
}

export function ForumPreviewCard() {
  const [posts, setPosts] = useState<ForumPostPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.get("/posts", { params: { page: 1, pageSize: 3 } });
      const data = res.data;

      const list: ForumPostPreview[] = Array.isArray(data)
        ? data
        : (data?.items ?? data?.entries ?? data?.posts ?? []);

      setPosts(list);
    } catch (e: unknown) {
      setErr(getErrMsg(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="card">
      <CardHeader
        title="Viimased postitused foorumis"
        right={
          <PrimaryLinkButton to="/forum">Vaata kõiki postitusi</PrimaryLinkButton>
        }
        subtitle={
          <>
            Kasutajad saavad jagada kogemusi, kas oma nimega või anonüümselt.
          </>
        }
      />

      {err && (
        <div className="alert alert--info">
          <div style={{ fontWeight: 900, marginBottom: 6 }}>Ei saanud postitusi laadida</div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>{err}</div>
        </div>
      )}

      {!err && (
        <div className="grid" style={{ marginTop: 14 }}>
          {loading && posts.length === 0 ? (
            <div className="help">Laen postitusi…</div>
          ) : posts.length === 0 ? (
            <div className="help">Foorumis pole veel postitusi.</div>
          ) : (
            posts.map((p) => (
              <Link key={p.id} to="/forum" className="forumCard">
                <div className="forumCard__top">
                  <span className="badge"> 
                    {p.isAnonymous ? "Anonüümne" : p.authorDisplayName ?? "Kasutaja"} 
                  </span>
                  <span className="forumCard__title">{p.title}</span>
                </div>
                <div className="forumCard__body">{clip(p.body)}</div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
