import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { AdminQuizDraft, AdminQuizItemDraft, AdminChannel } from "../../types/adminQuiz";
import { createAdminQuiz, fetchAdminQuizItems, updateAdminQuiz } from "../../api/adminQuiz";
import { PreviewTemplate } from "../../components/previews/PreviewTemplates";
import type { UiPreview } from "../../types/quiz";
import { defaultTemplateFor } from "../../components/previews/templates";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function emptyItem(): AdminQuizItemDraft {
  return {
    channel: 1,
    sender: "",
    subject: "",
    bodyPreview: "",
    isPhishing: false,
    explanationTitle: "",
    explanationText: "",
  };
}

function toUiPreview(date: string, it: AdminQuizItemDraft, idx: number): UiPreview {
  return {
    id: `draft-${idx}`,
    date,
    channel: it.channel === 2 ? "SMS" : "EMAIL",
    sender: it.sender || "Saatja",
    subject: it.subject || "(ilma pealkirjata)",
    bodyPreview: it.bodyPreview || "",
  } as any;
}

export default function AdminCreateQuizPage() {
  const q = useQuery();
  const navigate = useNavigate();

  const [date, setDate] = useState(q.get("date") ?? "");
  const [items, setItems] = useState<AdminQuizItemDraft[]>([emptyItem(), emptyItem(), emptyItem()]);
  const [stepIndex, setStepIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [exists, setExists] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [savedOk, setSavedOk] = useState(false);

  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSummary = stepIndex >= 3;

  const current = useMemo(() => (isSummary ? null : items[stepIndex]), [items, stepIndex, isSummary]);

  const uiPreview = useMemo(() => {
    if (!current) return null;
    return toUiPreview(date || "—", current, stepIndex);
  }, [current, date, stepIndex]);

  useEffect(() => {
    if (!date) return;

    (async () => {
      setLoading(true);
      setInfo(null);
      setError(null);
      setSavedOk(false);

      try {
        const data = await fetchAdminQuizItems(date);
        const list = Array.isArray(data) ? data : (data?.items ?? data?.entries ?? data?.results ?? []);

        if (Array.isArray(list) && list.length > 0) {
          const mapped: AdminQuizItemDraft[] = [0, 1, 2].map((i) => {
            const x = list[i];
            if (!x) return emptyItem();
            return {
              channel: (x.channel ?? 1) as AdminChannel,
              sender: x.sender ?? "",
              subject: x.subject ?? "",
              bodyPreview: x.bodyPreview ?? "",
              isPhishing: Boolean(x.isPhishing),
              explanationTitle: x.explanationTitle ?? "",
              explanationText: x.explanationText ?? "",
            };
          });

          setItems(mapped);
          setExists(true);
          setInfo("Laadisin olemasoleva viktoriini. Muuda vajadusel ja salvesta kokkuvõttes.");
        } else {
          setItems([emptyItem(), emptyItem(), emptyItem()]);
          setExists(false);
          setInfo("Sellele kuupäevale pole veel viktoriini. Täida 3 sammu ja salvesta kokkuvõttes.");
        }

        setIsDirty(false);
        setStepIndex(0);
      } catch (e: any) {
        setItems([emptyItem(), emptyItem(), emptyItem()]);
        setExists(false);
        setIsDirty(false);
        setStepIndex(0);
        setError(
          e?.response?.data?.title ??
            e?.response?.data?.message ??
            e?.message ??
            "Viktoriini laadimine ebaõnnestus"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [date]);

  function setField<K extends keyof AdminQuizItemDraft>(key: K, value: AdminQuizItemDraft[K]) {
    setItems((prev) => prev.map((x, i) => (i === stepIndex ? { ...x, [key]: value } : x)));
    setIsDirty(true);
    setSavedOk(false);
    setInfo(null);
    setError(null);
  }

  function setItemAt(idx: number, patch: Partial<AdminQuizItemDraft>) {
    setItems((prev) => prev.map((x, i) => (i === idx ? { ...x, ...patch } : x)));
    setIsDirty(true);
    setSavedOk(false);
    setInfo(null);
    setError(null);
  }

  function canProceed(it: AdminQuizItemDraft) {
    if (!date) return false;
    if (!it.sender.trim()) return false;
    if (it.channel === 1 && !it.subject.trim()) return false;
    if (!it.bodyPreview.trim()) return false;
    if (!it.explanationText.trim()) return false;
    return true;
  }

  const canGoNext = useMemo(() => {
    if (!current) return false;
    return canProceed(current);
  }, [current, date, items, stepIndex]);

  async function onSave() {
    if (!date || saving) return;

    setSaving(true);
    setInfo(null);
    setError(null);

    try {
      if (exists) {
        await updateAdminQuiz(date, items);
        setInfo("Muudatused salvestatud ✅");
      } else {
        const payload: AdminQuizDraft = { date, items };
        await createAdminQuiz(payload);
        setExists(true);
        setInfo("Viktoriin loodud ✅");
      }

      setIsDirty(false);
      setSavedOk(true);
    } catch (e: any) {
      setSavedOk(false);
      setError(
        e?.response?.data?.title ??
          e?.response?.data?.message ??
          e?.message ??
          "Salvestamine ebaõnnestus"
      );
    } finally {
      setSaving(false);
    }
  }

  function onNext() {
    if (!current) return;
    if (!canProceed(current)) return;
    setStepIndex(stepIndex === 2 ? 3 : stepIndex + 1);
  }

  function onBack() {
    if (isSummary) {
      setStepIndex(2);
      return;
    }
    setStepIndex((x) => Math.max(0, x - 1));
  }

  const canFinish = useMemo(() => {
    if (!date) return false;
    if (saving || loading) return false;
    if (isDirty) return false;
    if (!savedOk) return false;
    return true;
  }, [date, saving, loading, isDirty, savedOk]);

  return (
    <div className="page">
      <div className="container">
        <header className="topbar" style={{ marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: 0 }}>Viktoriini koostamine</h1>
            <div className="help" style={{ marginTop: 6 }}>
              {isSummary ? "Kokkuvõte" : `Samm ${stepIndex + 1} / 3`} • kuupäev: <b>{date || "—"}</b>
            </div>
          </div>

          <nav className="nav">
            <Link className="btn btn--ghost" to="/admin/quizzes">← Kalendrisse</Link>
          </nav>
        </header>

        <div className="card" style={{ marginBottom: 18 }}>
          <div className="adminDateRow">
            <div className="help" style={{ marginTop: 0 }}>Vali kuupäev</div>
            <input
              className="input"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setStepIndex(0);
                setInfo(null);
                setError(null);
              }}
              style={{ maxWidth: 260 }}
            />
          </div>

          {loading && <div className="help">Laen viktoriini…</div>}
          {info && <div className="alert alert--info" style={{ marginTop: 12 }}>{info}</div>}
          {error && <div className="alert alert--error" style={{ marginTop: 12 }}>{error}</div>}
        </div>

        {isSummary ? (
          <div className="card">
            <h2 className="card__title">Kokkuvõte</h2>

            <div className="grid" style={{ marginTop: 14, gap: 12 }}>
              {items.map((it, idx) => (
                <div key={idx} className="lbRow" style={{ gridTemplateColumns: "80px 1fr 220px" }}>
                  <div className="badge">Samm {idx + 1}</div>
                  <div className="lbRow__name">
                    {(it.channel === 2 ? "SMS" : "E-kiri")} • {it.sender || "—"}
                  </div>
                  <div className="lbRow__right">
                    <div className="lbRow__points">{it.isPhishing ? "Õngitsus" : "Mitte õngitsus"}</div>
                    <div className="lbRow__streak">{it.explanationTitle || "—"}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row" style={{ marginTop: 16, justifyContent: "space-between" }}>
              <button className="btn btn--ghost" onClick={onBack} disabled={saving || loading}>← Tagasi</button>

              <div className="row" style={{ gap: 10 }}>
                <button
                  className="btn"
                  onClick={onSave}
                  disabled={!date || saving || loading}
                >
                  {saving ? "Salvestan..." : exists ? "Salvesta muudatused" : "Loo viktoriin"}
                </button>

                <button
                  className="btn btn--primary"
                  onClick={() => navigate("/admin/quizzes")}
                  disabled={!canFinish}
                >
                  Edasi →
                </button>
              </div>
            </div>

            {!savedOk && (
              <div className="help">
                Enne “Edasi →” pead vajutama “{exists ? "Salvesta muudatused" : "Loo viktoriin"}”.
              </div>
            )}

            {isDirty && (
              <div className="help">
                Sul on salvestamata muudatusi. Salvesta, et edasi liikuda.
              </div>
            )}
          </div>
        ) : (
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
              <h2 className="card__title">Samm {stepIndex + 1}</h2>
              <span className="badge">{stepIndex + 1} / 3</span>
            </div>

            {current && (
              <>
                <div className="adminWizardGrid">
                  <div className="adminWizardLeft">
                    <div className="grid" style={{ gap: 12 }}>
                      <label className="field">
                        <span className="label">Kanal</span>
                        <select
                          className="input"
                          value={current.channel}
                          onChange={(e) => setField("channel", Number(e.target.value) as AdminChannel)}
                        >
                          <option value={1}>E-kiri</option>
                          <option value={2}>SMS</option>
                        </select>
                      </label>

                      <label className="field">
                        <span className="label">Saatja</span>
                        <input
                          className="input"
                          value={current.sender}
                          onChange={(e) => setField("sender", e.target.value)}
                        />
                      </label>

                      {current.channel === 1 && (
                        <label className="field">
                          <span className="label">Pealkiri</span>
                          <input
                            className="input"
                            value={current.subject}
                            onChange={(e) => setField("subject", e.target.value)}
                          />
                        </label>
                      )}

                      <label className="field">
                        <span className="label">{current.channel === 2 ? "Sõnumi tekst" : "Eelvaate tekst"}</span>
                        <textarea
                          className="input"
                          style={{ minHeight: 120 }}
                          value={current.bodyPreview}
                          onChange={(e) => setField("bodyPreview", e.target.value)}
                        />
                      </label>

                      <div className="row" style={{ gap: 10, alignItems: "center" }}>
                        <span className="label" style={{ marginRight: 6 }}>Õige vastus</span>
                        <button
                          className={`btn ${current.isPhishing ? "btn--primary" : ""}`}
                          type="button"
                          onClick={() => setField("isPhishing", true)}
                        >
                          Õngitsus
                        </button>
                        <button
                          className={`btn ${!current.isPhishing ? "btn--primary" : ""}`}
                          type="button"
                          onClick={() => setField("isPhishing", false)}
                        >
                          Mitte õngitsus
                        </button>
                      </div>

                      <label className="field">
                        <span className="label">Selgituse pealkiri</span>
                        <input
                          className="input"
                          value={current.explanationTitle}
                          onChange={(e) => setField("explanationTitle", e.target.value)}
                        />
                      </label>

                      <label className="field">
                        <span className="label">Selgitus</span>
                        <textarea
                          className="input"
                          style={{ minHeight: 120 }}
                          value={current.explanationText}
                          onChange={(e) => setField("explanationText", e.target.value)}
                        />
                      </label>
                    </div>

                    <div className="row" style={{ marginTop: 14, gap: 10 }}>
                      <button
                        className="btn btn--ghost"
                        type="button"
                        onClick={() => setItemAt(stepIndex, emptyItem())}
                        disabled={loading || saving}
                      >
                        Tühjenda samm
                      </button>
                    </div>
                  </div>

                  <div className="adminWizardRight">
                    <div className="help" style={{ marginTop: 0 }}>Reaalajas eelvaade</div>
                    <div className="quizTemplate" style={{ marginTop: 10 }}>
                      {uiPreview && (
                        <PreviewTemplate
                          template={defaultTemplateFor(uiPreview.channel)}
                          data={uiPreview}
                        />
                      )}
                    </div>

                    <div className="alert alert--info" style={{ marginTop: 12 }}>
                      Õige vastus: <b>{current.isPhishing ? "Õngitsus" : "Mitte õngitsus"}</b>
                      <div className="help" style={{ marginTop: 6, opacity: 0.9 }}>
                        Kasutaja näeb selgitust pärast kinnitamist.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row" style={{ marginTop: 16, justifyContent: "space-between" }}>
                  <button
                    className="btn btn--ghost"
                    onClick={onBack}
                    disabled={stepIndex === 0 || saving || loading}
                  >
                    ← Tagasi
                  </button>

                  <button
                    className="btn btn--primary"
                    onClick={onNext}
                    disabled={!canGoNext || loading || saving}
                  >
                    {stepIndex === 2 ? "Kokkuvõte →" : "Järgmine →"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
