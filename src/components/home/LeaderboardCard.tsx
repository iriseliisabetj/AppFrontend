import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/client";
import { CardHeader } from "../ui/CardHeader";
import { BadgeDetailsModal } from "../ui/BadgeDetailsModal";
import type { ProfileBadgeDto } from "../../types/profile";

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
  latestBadgeName?: string | null;
  latestBadgeDescription?: string | null;
  latestBadgeIconPath?: string | null;
  latestBadgeAwardedAt?: string | null;
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

function toBadgeDetails(row: LeaderboardRow): ProfileBadgeDto | null {
  if (!row.latestBadgeName || !row.latestBadgeIconPath) return null;

  return {
    badgeId: `leaderboard-${row.latestBadgeName}`,
    name: row.latestBadgeName,
    description: row.latestBadgeDescription ?? "Kirjeldus puudub.",
    iconPath: row.latestBadgeIconPath,
    isUnlocked: true,
    awardedAt: row.latestBadgeAwardedAt ?? null,
  };
}

export function LeaderboardCard({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<ProfileBadgeDto | null>(null);

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
    } catch (e: unknown) {
      const ex = e as {
        response?: { data?: { title?: string; message?: string } };
        message?: string;
      };

      const msg =
        ex?.response?.data?.title ??
        ex?.response?.data?.message ??
        ex?.message ??
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
    <>
      <div className="card card--soft">
        <CardHeader
          title="Edetabel"
          right={
            <button className="btn btn--ghost" onClick={load} disabled={loading}>
              {loading ? "Uuendan..." : "Uuenda"}
            </button>
          }
          subtitle={<>Punktid kogunevad viktoriinidele vastamisest.</>}
        />

        {err && (
          <div className="alert alert--info">
            <div style={{ fontWeight: 900, marginBottom: 6 }}>
              Ei saanud edetabelit laadida
            </div>
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
                {top.map((r, i) => {
                  const badgeDetails = toBadgeDetails(r);

                  return (
                    <div key={`${getRank(i, r)}-${getName(r)}`} className="lbRow">
                      <span className="badge">{getRank(i, r)}</span>

                      <div className="lbRow__name lbNameWithBadge">
                        <span>{getName(r)}</span>

                        {r.latestBadgeIconPath && badgeDetails && (
                          <button
                            type="button"
                            className="lbBadgeButton"
                            onClick={() => setSelectedBadge(badgeDetails)}
                            title={r.latestBadgeName ?? undefined}
                          >
                            <img
                              src={r.latestBadgeIconPath}
                              alt={r.latestBadgeName ?? ""}
                              className="lbBadgeIcon"
                            />
                          </button>
                        )}
                      </div>

                      <div className="lbRow__right">
                        <div className="lbRow__points">{getScore(r)} p</div>
                        <div className="lbRow__streak">
                          streak: {r.currentStreakDays ?? 0}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedBadge && (
        <BadgeDetailsModal
          badge={selectedBadge}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </>
  );
}