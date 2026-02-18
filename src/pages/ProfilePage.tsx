import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyProfile } from "../api/profile";
import type { MyProfileDto } from "../types/profile";

function fmtDateEt(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString("et-EE", { day: "2-digit", month: "long", year: "numeric" });
}

function streakLabel(days: number) {
  if (days <= 0) return "Pole veel alanud";
  if (days === 1) return "Alustasid!";
  if (days < 5) return "Hea hoog";
  if (days < 14) return "Väga hea rütm";
  return "Legendaarne streak";
}

function getErrMsg(e: unknown) {
  const ex = e as { message?: string; response?: { data?: { title?: string; message?: string } } };
  return (
    ex?.response?.data?.title ??
    ex?.response?.data?.message ??
    ex?.message ??
    "Profiili laadimine ebaõnnestus"
  );
}

export default function ProfilePage() {
  const [p, setP] = useState<MyProfileDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await fetchMyProfile();
        setP(data);
      } catch (e: unknown) {
        setErr(getErrMsg(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const lastActiveText = useMemo(() => {
    if (!p) return "—";
    if (!p.lastActiveDate) return "Pole veel aktiivne olnud";
    return fmtDateEt(p.lastActiveDate);
  }, [p]);

  const streakHint = useMemo(() => {
    if (!p) return "";
    return streakLabel(p.currentStreakDays);
  }, [p]);

  return (
    <div className="page">
      <div className="container">
        <header className="topbar" style={{ marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: 0 }}>Minu profiil</h1>
            <div className="help" style={{ marginTop: 6 }}>
              Siin on sinu punktid, streak ja kontoandmed.
            </div>
          </div>

          <nav className="nav">
            <Link className="btn btn--ghost" to="/">
              ← Avaleht
            </Link>
            <Link className="btn btn--primary" to="/quiz/today">
              Tänane viktoriin →
            </Link>
          </nav>
        </header>

        {loading && <div className="help">Laen profiili…</div>}
        {err && <div className="alert alert--error">{err}</div>}

        {!loading && !err && p && (
          <>
            <div className="card" style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div className="badge" style={{ display: "inline-flex", marginBottom: 10 }}>
                    @{p.username}
                  </div>
                  <h2 className="card__title" style={{ marginTop: 0 }}>
                    {p.username}
                  </h2>
                  <div className="help" style={{ marginTop: 8 }}>
                    <div>
                      <b>E-post:</b> {p.email}
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <b>Viimane aktiivsus:</b> {lastActiveText}
                    </div>
                  </div>
                </div>

                <div className="card card--soft" style={{ minWidth: 260 }}>
                  <div className="help" style={{ marginTop: 0 }}>
                    Kiirsoovitus
                  </div>
                  <div style={{ marginTop: 8, fontWeight: 900, letterSpacing: "-0.2px" }}>
                    Tee 3 eelvaadet päevas
                  </div>
                  <div className="help" style={{ marginTop: 6 }}>
                    Järjepidevus kasvatab mustrituvastust. Iga päev = streak + kindlam otsus.
                  </div>
                </div>
              </div>
            </div>

            <div className="grid profileStatsGrid" style={{ gap: 12 }}>
              <div className="stat">
                <div className="stat__title">Punktid kokku</div>
                <div className="stat__value">{p.totalPoints}</div>
                <div className="stat__hint">Punktid tulevad kinnitatud vastustest.</div>
              </div>

              <div className="stat">
                <div className="stat__title">Praegune streak</div>
                <div className="stat__value">{p.currentStreakDays}</div>
                <div className="stat__hint">{streakHint}</div>
              </div>

              <div className="stat">
                <div className="stat__title">Parim streak</div>
                <div className="stat__value">{p.bestStreakDays}</div>
                <div className="stat__hint">Sinu parim järjestikune päevade seeria.</div>
              </div>
            </div>

            <div className="card" style={{ marginTop: 18 }}>
              <h2 className="card__title">Eesmärk ja rütm</h2>

              <div className="grid" style={{ marginTop: 12, gap: 12 }}>
                <div className="step">
                  <div className="step__n">1</div>
                  <div>
                    <div className="step__title">Tee tänane viktoriin</div>
                    <div className="step__text">
                      3 eelvaadet päevas on optimaalne: kiire, aga piisav, et mustrid kinnistuks.
                    </div>
                  </div>
                </div>

                <div className="step">
                  <div className="step__n">2</div>
                  <div>
                    <div className="step__title">Loe selgitus läbi</div>
                    <div className="step__text">
                      Isegi kui vastad õigesti, selgitus annab “miks” — see on see, mis hiljem päriselus aitab.
                    </div>
                  </div>
                </div>

                <div className="step">
                  <div className="step__n">3</div>
                  <div>
                    <div className="step__title">Hoia streak elus</div>
                    <div className="step__text">
                      Kui jätad päeva vahele, kukub järjepidevus. Väike pingutus iga päev on parem kui harv “suur õppimine”.
                    </div>
                  </div>
                </div>
              </div>

              <div className="row" style={{ marginTop: 16 }}>
                <Link className="btn btn--primary" to="/quiz/today">
                  Alusta tänast viktoriini →
                </Link>
                <Link className="btn btn--ghost" to="/">
                  Tagasi avalehele
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
