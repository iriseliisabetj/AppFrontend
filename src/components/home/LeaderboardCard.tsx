import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/client";
import { CardHeader } from "../ui/CardHeader";

type LeaderboardRow = {
  rank?: number;
  position?: number;
  userName?: string;
  username?: string;
  displayName?: string;
  name?: string;
  score?: number;
  points?: number;
  totalPoints?: number;
  currentStreakDays?: number;
  bestStreakDays?: number;
};

function getName(r: LeaderboardRow) {
  return r.displayName ?? r.userName ?? r.username ?? r.name ?? "Kasutaja";
}
function getScore(r: LeaderboardRow) {
  const v = r.score ?? r.points ?? r.totalPoints;
  return typeof v === "number" ? v : 0;
}
function getRank(i: number, r: LeaderboardRow) {
  const v = r.rank ?? r.position;
  return typeof v === "number" ? v : i + 1;
}

export function LeaderboardCard({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const top = useMemo(() => rows.slice(0, 10), [rows]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.get("/quiz/leaderboard");
      const data = res.data;

      const list: LeaderboardRow[] = Array.isArray(data)
        ? data
        : (data?.entries ?? data?.items ?? data?.results ?? []);

      setRows(list);
    } catch (e: any) {
      const msg =
        e?.response?.data?.title ??
        e?.response?.data?.message ??
        e?.message ??
        "Leaderboardi laadimine ebaõnnestus";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="card card--soft">
      <CardHeader
        title="Edetabel"
        right={
          <button className="btn btn--ghost" onClick={load} disabled={loading}>
            {loading ? "Uuendan..." : "Uuenda"}
          </button>
        }
        subtitle={
          <>
            Punktid tulevad viktoriinide vastustest. Eesmärk on järjepidevus, mitte “täiuslik tulemus”.
          </>
        }
      />

      {err && (
        <div className="alert alert--info">
          <div style={{ fontWeight: 900, marginBottom: 6 }}>Ei saanud edetabelit laadida</div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>{err}</div>
          {!isLoggedIn && (
            <div className="help" style={{ marginTop: 8 }}>
              Kui edetabel on ainult sisseloginud kasutajatele, logi sisse ja proovi uuesti.
            </div>
          )}
        </div>
      )}

      {!err && (
        <div style={{ marginTop: 14 }}>
          {loading && top.length === 0 ? (
            <div className="help">Laen edetabelit…</div>
          ) : top.length === 0 ? (
            <div className="help">Edetabel on hetkel tühi.</div>
          ) : (
            <div className="grid" style={{ gap: 8 }}>
              {top.map((r, i) => (
                <div key={`${getRank(i, r)}-${getName(r)}`} className="lbRow">
                  <span className="badge">#{getRank(i, r)}</span>
                  <div className="lbRow__name">{getName(r)}</div>
                  <div className="lbRow__right">
                    <div className="lbRow__points">{getScore(r)} p</div>
                    <div className="lbRow__streak">
                      streak: {r.currentStreakDays ?? 0} (parim: {r.bestStreakDays ?? 0})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
