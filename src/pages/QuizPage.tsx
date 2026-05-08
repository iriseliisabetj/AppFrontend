import { useEffect, useMemo, useState } from "react";
import type { UiPreview, ApiQuizAnswerRequest } from "../types/quiz";
import { mapTodayQuizToPreviews } from "../types/quiz";
import { defaultTemplateFor } from "../components/previews/templates";
import { PreviewTemplate } from "../components/previews/PreviewTemplates";
import { PrimaryLinkButton, SecondaryLinkButton } from "../components/ui/Buttons";
import { answerTodaysQuiz, getTodaysQuiz } from "../api/quiz";
import { fetchMyBadges } from "../api/profile";
import { getUnseenBadges, markBadgeSeen } from "../auth/badgeUnlocks";
import { BadgeUnlocked } from "../components/ui/BadgeUnlocked";
import type { ProfileBadgeDto } from "../types/profile";
import { ProgressBar } from "../components/ui/ProgressBar";
import { PageLayout } from "../components/layout/PageLayout";
import confetti from "canvas-confetti";

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

function fireCorrectAnswerConfetti() {
  void confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.65 },
  });

  window.setTimeout(() => {
    void confetti({
      particleCount: 60,
      spread: 90,
      origin: { x: 0.2, y: 0.7 },
    });

    void confetti({
      particleCount: 60,
      spread: 90,
      origin: { x: 0.8, y: 0.7 },
    });
  }, 180);
}

export default function QuizPage() {
  const [previews, setPreviews] = useState<UiPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<AnswerChoice | null>(null);

  const [answers, setAnswers] = useState<Record<string, StepAnswer>>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedbackShown, setFeedbackShown] = useState(false);

  const [badgeQueue, setBadgeQueue] = useState<ProfileBadgeDto[]>([]);
  const [badgesChecked, setBadgesChecked] = useState(false);

  const totalCount = 3;
  const isSummary = stepIndex >= 3;

  function closeBadgeModal() {
    const currentBadge = badgeQueue[0];
    if (currentBadge) {
      markBadgeSeen(currentBadge);
    }
    setBadgeQueue((prev) => prev.slice(1));
  }

  useEffect(() => {
    if (!isSummary || badgesChecked) return;

    (async () => {
      try {
        const badges = await fetchMyBadges();
        const unseen = getUnseenBadges(badges);
        if (unseen.length > 0) {
          setBadgeQueue(unseen);
        }
      } catch {
      } finally {
        setBadgesChecked(true);
      }
    })();
  }, [isSummary, badgesChecked]);

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
        setBadgeQueue([]);
        setBadgesChecked(false);
      } catch (e: unknown) {
        const msg =
          e &&
          typeof e === "object" &&
          "message" in e &&
          typeof (e as { message?: unknown }).message === "string"
            ? (e as { message: string }).message
            : "Tänase viktoriini laadimine ebaõnnestus";

        setLoadError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const current = useMemo(() => {
    if (isSummary) return null;
    return previews[stepIndex] ?? null;
  }, [previews, stepIndex, isSummary]);

  const currentAnswer = useMemo(() => {
    if (!current) return null;
    return answers[current.id] ?? null;
  }, [answers, current]);

  useEffect(() => {
    if (!current) return;
    const prev = answers[current.id];
    setSelectedChoice(prev?.choice ?? null);
    setFeedbackShown(Boolean(prev?.isCorrect !== undefined));
  }, [current?.id, answers, current]);

  async function onConfirm() {
    if (!current || !selectedChoice || submitting) return;

    setSubmitting(true);

    try {
      const payload: ApiQuizAnswerRequest = {
        quizItemId: current.id,
        answerIsPhishing: selectedChoice === "PHISHING",
      };

      const data = await answerTodaysQuiz(payload);
      if (data.correct) {
        fireCorrectAnswerConfetti();
      }

      setAnswers((prev) => ({
        ...prev,
        [current.id]: {
          previewId: current.id,
          choice: selectedChoice,
          isCorrect: data.correct,
          explanation:
            (data.explanationTitle ? data.explanationTitle + " — " : "") +
            data.explanationText,
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

    if (stepIndex === 2) {
      setStepIndex(3);
    } else {
      setStepIndex((x) => x + 1);
    }
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
    <PageLayout>
      <section style={{ marginBottom: 18 }}>
        <h1 style={{ margin: 0 }}>Tänane viktoriin</h1>
        <div className="help" style={{ marginTop: 6 }}>
          Otsusta, kas tegemist on õngitsusega või mitte.
        </div>
      </section>

      {!isSummary && (
        <div style={{ marginBottom: 14 }}>
          <ProgressBar
            current={stepIndex + 1}
            total={totalCount}
            label="Viktoriini edenemine"
          />
        </div>
      )}

      {loading && <div className="help">Laen…</div>}
      {loadError && <div className="alert alert--error">{loadError}</div>}

      {!loading && !loadError && previews.length === 0 && (
        <div className="alert alert--info">Tänaseks ei ole eelvaateid.</div>
      )}

      {!loading && !loadError && previews.length > 0 && (
        <>
          {isSummary ? (
            <section className="card">
              <h2 className="card__title">Sinu tulemus</h2>

              <div
                className="grid profileStatsGrid"
                style={{ marginTop: 14, gap: 12 }}
              >
                <div className="stat">
                  <div className="stat__title">Vastatud</div>
                  <div className="stat__value">{summary.answered}/3</div>
                </div>

                <div className="stat">
                  <div className="stat__title">Õiged</div>
                  <div className="stat__value">{summary.correct}</div>
                </div>

                <div className="stat">
                  <div className="stat__title">Teenitud punktid</div>
                  <div className="stat__value">{summary.points}</div>
                </div>
              </div>

              <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                {previews.map((preview, idx) => {
                  const answer = answers[preview.id];
                  const alertClass =
                    answer?.isCorrect === true
                      ? "alert alert--info"
                      : answer?.isCorrect === false
                      ? "alert alert--error"
                      : "alert alert--info";

                  return (
                    <div key={preview.id} className={alertClass} style={{ marginTop: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span className="badge">Küsimus {idx + 1}</span>
                            <span style={{ fontWeight: 900 }}>
                              {preview.channel === "SMS" ? "SMS" : "E-kiri"} • {preview.sender}
                            </span>
                          </div>

                          <div className="help" style={{ marginTop: 8, opacity: 0.9 }}>
                            Sinu valik: <b>{answer?.choice ? choiceLabel(answer.choice) : "—"}</b>
                          </div>
                        </div>

                        <div style={{ fontWeight: 900 }}>
                          {answer?.isCorrect
                            ? "Õige ✅"
                            : answer?.isCorrect === false
                            ? "Vale ❌"
                            : "Kinnitamata"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="row" style={{ marginTop: 16 }}>
                <PrimaryLinkButton to="/">Tagasi avalehele</PrimaryLinkButton>
                <SecondaryLinkButton to="/profile">
                  Vaata profiililt statistikat
                </SecondaryLinkButton>
              </div>
            </section>
          ) : (
            <section className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 10,
                }}
              >
              </div>

              <div className="quizTemplate">
                <PreviewTemplate
                  template={defaultTemplateFor(current!.channel)}
                  data={current!}
                />
              </div>

              <div style={{ marginTop: 14 }}>
                <div className="row" style={{ marginTop: 10 }}>
                  <button
                    className="btn"
                    onClick={() => setSelectedChoice("PHISHING")}
                    style={{
                      border:
                        selectedChoice === "PHISHING"
                          ? "2px solid rgba(0,0,0,0.35)"
                          : undefined,
                    }}
                    disabled={feedbackShown}
                  >
                    Õngitsus
                  </button>

                  <button
                    className="btn"
                    onClick={() => setSelectedChoice("NOT_PHISHING")}
                    style={{
                      border:
                        selectedChoice === "NOT_PHISHING"
                          ? "2px solid rgba(0,0,0,0.35)"
                          : undefined,
                    }}
                    disabled={feedbackShown}
                  >
                    Mitte õngitsus
                  </button>

                  <button
                    className="btn btn--primary"
                    onClick={onConfirm}
                    disabled={!selectedChoice || submitting || feedbackShown}
                  >
                    {submitting ? "Kontrollin..." : "Kinnita vastus"}
                  </button>
                </div>

                {currentAnswer?.isCorrect !== undefined && (
                  <div
                    className={`alert ${
                      currentAnswer.isCorrect ? "alert--info" : "alert--error"
                    }`}
                    style={{ marginTop: 12 }}
                  >
                    <div style={{ fontWeight: 900, marginBottom: 6 }}>
                      {currentAnswer.isCorrect
                        ? "Õige vastus ✅"
                        : "Vale vastus ❌"}
                    </div>

                    <div style={{ fontSize: 13, opacity: 0.9 }}>
                      Sinu valik: <b>{choiceLabel(currentAnswer.choice)}</b>{" "}
                      {" • "} Teenitud punktid:{" "}
                      <b>{currentAnswer.pointsAwarded ?? 0}</b>
                    </div>

                    {currentAnswer.explanation && (
                      <div className="help" style={{ marginTop: 8, opacity: 0.9 }}>
                        {currentAnswer.explanation}
                      </div>
                    )}

                    <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>
                      Kokku punkte: <b>{currentAnswer.totalPoints}</b>
                    </div>
                  </div>
                )}
              </div>

              <div
                className="row"
                style={{ marginTop: 14, justifyContent: "space-between" }}
              >
                <button
                  className="btn btn--ghost"
                  onClick={onBack}
                  disabled={stepIndex === 0}
                >
                  ← Tagasi
                </button>

                <button
                  className="btn btn--primary"
                  onClick={onNext}
                  disabled={!feedbackShown}
                >
                  {stepIndex === 2 ? "Vaata tulemust →" : "Järgmine →"}
                </button>
              </div>

              {!feedbackShown && (
                <div className="help">
                  Pead kinnitama vastuse, et saada tagasiside ja liikuda edasi.
                </div>
              )}
            </section>
          )}
        </>
      )}

      {badgeQueue.length > 0 && (
        <BadgeUnlocked badge={badgeQueue[0]} onClose={closeBadgeModal} />
      )}
    </PageLayout>
  );
}