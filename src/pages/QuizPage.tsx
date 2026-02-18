import { useEffect, useMemo, useState } from "react";
import type { UiPreview, ApiQuizAnswerRequest } from "../types/quiz";
import { mapTodayQuizToPreviews } from "../types/quiz";
import { defaultTemplateFor } from "../components/previews/templates";
import { PreviewTemplate } from "../components/previews/PreviewTemplates";
import { PrimaryLinkButton, SecondaryLinkButton } from "../components/ui/Buttons";
import { Link } from "react-router-dom";
import { answerTodaysQuiz, getTodaysQuiz } from "../api/quiz";

type AnswerChoice = "PHISHING" | "NOT_PHISHING";

type StepAnswer = {
  previewId: string;
  choice: AnswerChoice;
  isCorrect?: boolean;
  explanation?: string;
  pointsAwarded?: number;
  totalPoints?: number;
  currentStreakDays?: number;
  bestStreakDays?: number;
};

function choiceLabel(c: AnswerChoice) {
  return c === "PHISHING" ? "Õngitsus" : "Pole õngitsus";
}

export default function QuizTodayPage() {
  const [previews, setPreviews] = useState<UiPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<AnswerChoice | null>(null);

  const [answers, setAnswers] = useState<Record<string, StepAnswer>>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedbackShown, setFeedbackShown] = useState(false);

  const isSummary = stepIndex >= 3;

  const current = useMemo(() => {
    if (isSummary) return null;
    return previews[stepIndex] ?? null;
  }, [previews, stepIndex, isSummary]);

  const currentAnswer = useMemo(() => {
    if (!current) return null;
    return answers[current.id] ?? null;
  }, [answers, current]);

  const totalCount = 3;

  useEffect(() => {
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await getTodaysQuiz();
        const mapped = mapTodayQuizToPreviews(data).slice(0, 3);
        setPreviews(mapped);

        setStepIndex(0);
        setSelectedChoice(null);
        setAnswers({});
        setFeedbackShown(false);
      } catch (e: unknown) {
        const msg =
          (e && typeof e === "object" && "message" in e && typeof (e as { message?: unknown }).message === "string"
            ? (e as { message: string }).message
            : "Tänase viktoriini laadimine ebaõnnestus");
        setLoadError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!current) return;
    const prev = answers[current.id];
    setSelectedChoice(prev?.choice ?? null);
    setFeedbackShown(Boolean(prev?.isCorrect !== undefined));
  }, [current?.id, answers, current]);

  const progressText = useMemo(() => {
    if (isSummary) return "Tulemus";
    return `Samm ${stepIndex + 1} / ${totalCount}`;
  }, [isSummary, stepIndex]);

  async function onConfirm() {
    if (!current || !selectedChoice || submitting) return;

    setSubmitting(true);
    try {
      const payload: ApiQuizAnswerRequest = {
        quizItemId: current.id,
        answerIsPhishing: selectedChoice === "PHISHING",
      };

      const data = await answerTodaysQuiz(payload);

      setAnswers((prev) => ({
        ...prev,
        [current.id]: {
          previewId: current.id,
          choice: selectedChoice,
          isCorrect: data.correct,
          explanation: (data.explanationTitle ? data.explanationTitle + " — " : "") + data.explanationText,
          pointsAwarded: data.pointsAwarded,
          totalPoints: data.totalPoints,
          currentStreakDays: data.currentStreakDays,
          bestStreakDays: data.bestStreakDays,
        },
      }));

      setFeedbackShown(true);
    } finally {
      setSubmitting(false);
    }
  }

  function onNext() {
    if (!current) return;
    const a = answers[current.id];
    if (!a || a.isCorrect === undefined) return;

    if (stepIndex === 2) setStepIndex(3);
    else setStepIndex((x) => x + 1);
  }

  function onBack() {
    if (isSummary) {
      setStepIndex(2);
      return;
    }
    if (stepIndex === 0) return;
    setStepIndex((x) => x - 1);
  }

  const summary = useMemo(() => {
    const list = previews.map((p) => answers[p.id]).filter(Boolean) as StepAnswer[];
    const correct = list.filter((x) => x.isCorrect).length;
    const points = list.reduce((sum, x) => sum + (x.pointsAwarded ?? 0), 0);
    return { answered: list.length, correct, points };
  }, [answers, previews]);

  return (
    <div className="page">
      <div className="container">
        <header className="topbar" style={{ marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: 0 }}>Tänane viktoriin</h1>
            <div className="help" style={{ marginTop: 6 }}>
              {progressText} • 3 eelvaadet • vali “Õngitsus” või “Mitte õngitsus” ja kinnita.
            </div>
          </div>

          <nav className="nav">
            <Link className="btn btn--ghost" to="/">
              ← Avaleht
            </Link>
          </nav>
        </header>

        {loading && <div className="help">Laen…</div>}
        {loadError && <div className="alert alert--error">{loadError}</div>}

        {!loading && !loadError && previews.length === 0 && (
          <div className="alert alert--info">Tänaseks ei ole eelvaateid.</div>
        )}

        {!loading && !loadError && previews.length > 0 && (
          <>
            {isSummary ? (
              <div className="card">
                <h2 className="card__title">Sinu tulemus</h2>

                <div className="grid" style={{ marginTop: 14, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" as any }}>
                  <div className="stat">
                    <div className="stat__title">Vastatud</div>
                    <div className="stat__value">{summary.answered}/3</div>
                    <div className="stat__hint">Täna tehtud sammud.</div>
                  </div>
                  <div className="stat">
                    <div className="stat__title">Õiged</div>
                    <div className="stat__value">{summary.correct}</div>
                    <div className="stat__hint">Õige otsus = parem mustritaju.</div>
                  </div>
                  <div className="stat">
                    <div className="stat__title">Punktid</div>
                    <div className="stat__value">{summary.points}</div>
                    <div className="stat__hint">Punktid tulevad kinnitatud vastustest.</div>
                  </div>
                </div>

                <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                  {previews.map((p, idx) => {
                    const a = answers[p.id];
                    return (
                      <div key={p.id} className="lbRow" style={{ gridTemplateColumns: "80px 1fr 200px" }}>
                        <div className="badge">Samm {idx + 1}</div>
                        <div className="lbRow__name">
                          {p.channel === "SMS" ? "SMS" : "E-kiri"} • {p.sender}
                        </div>
                        <div className="lbRow__right">
                          <div className="lbRow__points">
                            {a?.isCorrect ? "Õige" : a?.isCorrect === false ? "Vale" : "Kinnitamata"}
                          </div>
                          <div className="lbRow__streak">Sinu valik: {a?.choice ? choiceLabel(a.choice) : "—"}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="row" style={{ marginTop: 16 }}>
                  <PrimaryLinkButton to="/">Tagasi avalehele</PrimaryLinkButton>
                  <SecondaryLinkButton to="/profile">Vaata statistikat</SecondaryLinkButton>
                  <button className="btn btn--ghost" onClick={() => setStepIndex(0)}>
                    Tee uuesti
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid" style={{ gap: 14 }}>
                <div className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                    <h2 className="card__title">Eelvaade</h2>
                    <span className="badge">{stepIndex + 1} / 3</span>
                  </div>

                  <div className="quizTemplate">
                    <PreviewTemplate template={defaultTemplateFor(current!.channel)} data={current!} />
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <div className="help" style={{ marginTop: 0 }}>
                      Tee otsus enne kui “klikid”: kas see on õngitsus?
                    </div>

                    <div className="row" style={{ marginTop: 10 }}>
                      <button
                        className="btn"
                        onClick={() => setSelectedChoice("PHISHING")}
                        style={{ border: selectedChoice === "PHISHING" ? "2px solid rgba(0,0,0,0.35)" : undefined }}
                        disabled={feedbackShown}
                      >
                        Õngitsus
                      </button>

                      <button
                        className="btn"
                        onClick={() => setSelectedChoice("NOT_PHISHING")}
                        style={{ border: selectedChoice === "NOT_PHISHING" ? "2px solid rgba(0,0,0,0.35)" : undefined }}
                        disabled={feedbackShown}
                      >
                        Mitte õngitsus
                      </button>

                      <button className="btn btn--primary" onClick={onConfirm} disabled={!selectedChoice || submitting || feedbackShown}>
                        {submitting ? "Kontrollin..." : "Kinnita vastus"}
                      </button>
                    </div>

                    {currentAnswer?.isCorrect !== undefined && (
                      <div className={`alert ${currentAnswer.isCorrect ? "alert--info" : "alert--error"}`} style={{ marginTop: 12 }}>
                        <div style={{ fontWeight: 900, marginBottom: 6 }}>
                          {currentAnswer.isCorrect ? "Õige vastus ✅" : "Vale vastus ❌"}
                        </div>

                        <div style={{ fontSize: 13, opacity: 0.9 }}>
                          Sinu valik: <b>{choiceLabel(currentAnswer.choice)}</b> {" • "} Punktid:{" "}
                          <b>{currentAnswer.pointsAwarded ?? 0}</b>
                        </div>

                        {currentAnswer.explanation && (
                          <div className="help" style={{ marginTop: 8, opacity: 0.9 }}>
                            {currentAnswer.explanation}
                          </div>
                        )}

                        <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>
                          Kokku punktid: <b>{currentAnswer.totalPoints}</b> {" • "} Järjestikused päevad:{" "}
                          <b>{currentAnswer.currentStreakDays}</b> {" • "} Parim streak:{" "}
                          <b>{currentAnswer.bestStreakDays}</b>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="row" style={{ marginTop: 14, justifyContent: "space-between" }}>
                    <button className="btn btn--ghost" onClick={onBack} disabled={stepIndex === 0}>
                      ← Tagasi
                    </button>

                    <button className="btn btn--primary" onClick={onNext} disabled={!feedbackShown}>
                      {stepIndex === 2 ? "Vaata tulemust →" : "Järgmine →"}
                    </button>
                  </div>

                  {!feedbackShown && <div className="help">Pead kinnitama vastuse, et saada tagasiside ja liikuda edasi.</div>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
