import { useEffect, useMemo, useRef, useState } from "react";
import { getLeaderboard } from "../../api/quiz";
import { CardHeader } from "../ui/CardHeader";
import { BadgeDetailsModal } from "../ui/BadgeDetailsModal";
import type { ProfileBadgeDto } from "../../types/profile";
import { fetchMyProfile } from "../../api/profile";

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
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  const currentUserRowRef = useRef<HTMLDivElement | null>(null);

  const visibleRows = useMemo(() => rows, [rows]);

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      const [leaderboardData, profileRes] = await Promise.all([
        getLeaderboard(100),
        isLoggedIn ? fetchMyProfile() : Promise.resolve(null),
      ]);

      const data = leaderboardData;

      const list: LeaderboardRow[] = Array.isArray(data)
        ? data
        : data?.entries ?? data?.items ?? data?.results ?? [];

      setRows(list);
      setCurrentUsername(profileRes?.username ?? null);
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

  useEffect(() => {
    if (currentUserRowRef.current) {
      currentUserRowRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [visibleRows, currentUsername]);

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
          </div>
        )}

        {!err && (
          <div style={{ marginTop: 14 }}>
            {loading && visibleRows.length === 0 ? (
              <div className="help">Laen edetabelit…</div>
            ) : visibleRows.length === 0 ? (
              <div className="help">Edetabel on hetkel tühi.</div>
            ) : (
              <div className="leaderboardScroll">
                <div className="grid" style={{ gap: 8 }}>
                  {visibleRows.map((r, i) => {
                    const badgeDetails = toBadgeDetails(r);
                    const isCurrentUser =
                      Boolean(currentUsername) &&
                      getName(r).trim().toLowerCase() === currentUsername?.trim().toLowerCase();

                    return (
                      <div
                        key={`${getRank(i, r)}-${getName(r)}`}
                        ref={isCurrentUser ? currentUserRowRef : null}
                        className={`lbRow ${isCurrentUser ? "lbRow--currentUser" : ""}`}
                      >
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