import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteAdminQuiz, fetchAdminQuizItems } from "../../api/adminQuiz";

function isoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function monthLabel(d: Date) {
  return d.toLocaleDateString("et-EE", { month: "long", year: "numeric" });
}

async function existsQuiz(date: string): Promise<boolean> {
  try {
    const data = await fetchAdminQuizItems(date);
    const list = Array.isArray(data) ? data : (data?.items ?? data?.entries ?? data?.posts ?? []);
    return Array.isArray(list) && list.length > 0;
  } catch {
    return false;
  }
}

export default function AdminViewQuizPage() {
  const navigate = useNavigate();
  const [month, setMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string>(isoDate(new Date()));
  const [statusByDate, setStatusByDate] = useState<Record<string, "HAS" | "NONE">>({});
  const [loading, setLoading] = useState(false);

  const days = useMemo(() => {
    const s = startOfMonth(month);
    const startWeekday = (s.getDay() + 6) % 7;
    const gridStart = addDays(s, -startWeekday);
    const out: { date: Date; inMonth: boolean; iso: string }[] = [];
    for (let i = 0; i < 42; i++) {
      const d = addDays(gridStart, i);
      out.push({ date: d, inMonth: d.getMonth() === month.getMonth(), iso: isoDate(d) });
    }
    return out;
  }, [month]);

  const inMonthIsos = useMemo(() => {
    return Array.from(new Set(days.filter((d) => d.inMonth).map((d) => d.iso)));
  }, [days]);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      try {
        const next: Record<string, "HAS" | "NONE"> = {};
        for (const d of inMonthIsos) next[d] = "NONE";
        if (alive) setStatusByDate(next);

        for (const d of inMonthIsos) {
          const ok = await existsQuiz(d);
          next[d] = ok ? "HAS" : "NONE";
          if (alive) setStatusByDate({ ...next });
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [inMonthIsos]);

  async function onDelete(date: string) {
    if (!window.confirm(`Kustutan viktoriini kuupäeval ${date}?`)) return;
    await deleteAdminQuiz(date);
    setStatusByDate((p) => ({ ...p, [date]: "NONE" }));
  }

  function onSelect(d: { iso: string; inMonth: boolean }) {
    setSelectedDate(d.iso);
  }

  return (
    <div className="page">
      <div className="container">
        <header className="topbar" style={{ marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: 0 }}>Halda viktoriine</h1>
            <div className="help" style={{ marginTop: 6 }}>
              Roheline/punane kehtib ainult käesoleva kuu päevadele. Hallid on eelmise/järgmise kuu päevad.
            </div>
          </div>
          <nav className="nav">
            <Link className="btn btn--ghost" to="/">← Avaleht</Link>
            <button className="btn btn--primary" onClick={() => navigate(`/admin/quizzes/new?date=${selectedDate}`)}>
              Loo / muuda valitud päeva →
            </button>
          </nav>
        </header>

        <div className="card">
          <div className="adminCalTop">
            <button className="btn btn--ghost" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
              ←
            </button>
            <div className="adminCalTitle">{monthLabel(month)}</div>
            <button className="btn btn--ghost" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
              →
            </button>
          </div>

          <div className="adminCalWeek">
            <div>E</div><div>T</div><div>K</div><div>N</div><div>R</div><div>L</div><div>P</div>
          </div>

          <div className="adminCalGrid">
            {days.map((d) => {
              const isSelected = d.iso === selectedDate;

              if (!d.inMonth) {
                const cls =
                  "adminCalDay adminCalDay--muted " +
                  (isSelected ? "adminCalDay--selected" : "");

                return (
                  <div
                    key={d.iso}
                    className={cls}
                    onClick={() => onSelect(d)}
                    role="button"
                  >
                    <div className="adminCalNum">{d.date.getDate()}</div>
                  </div>
                );
              }

              const st = statusByDate[d.iso] ?? "NONE";
              const cls =
                "adminCalDay " +
                (st === "HAS" ? "adminCalDay--has " : "adminCalDay--none ") +
                (isSelected ? "adminCalDay--selected" : "");

              return (
                <div
                  key={d.iso}
                  className={cls}
                  onClick={() => onSelect(d)}
                  role="button"
                >
                  <div className="adminCalNum">{d.date.getDate()}</div>

                  <div className="adminCalBadges">
                    <span className={`badge ${st === "HAS" ? "badge--ok" : "badge--bad"}`}>
                      {st === "HAS" ? "On" : "Puudu"}
                    </span>

                    {st === "HAS" && (
                      <button
                        className="btn btn--ghost adminCalDel"
                        onClick={(e) => { e.stopPropagation(); onDelete(d.iso); }}
                      >
                        Kustuta
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {loading && <div className="help">Kontrollin käesoleva kuu kuupäevi…</div>}
        </div>
      </div>
    </div>
  );
}
