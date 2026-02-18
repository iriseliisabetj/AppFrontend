export type ApiTodayQuiz = {
  date: string;
  items: ApiQuizItem[];
};

export type ApiQuizItem = {
  id: string;
  channel: number;
  sender: string;
  subject: string;
  bodyPreview: string;
};

export type UiChannel = "EMAIL" | "SMS";

export type UiPreview = {
  id: string;
  channel: UiChannel;
  sender: string;
  subject?: string;
  bodyPreview: string;
  date: string;
};

export function mapChannel(channel: number): UiChannel {
  if (channel === 1) return "EMAIL";
  return "SMS";
}

export function mapTodayQuizToPreviews(dto: ApiTodayQuiz): UiPreview[] {
  return (dto.items ?? []).map((x) => ({
    id: x.id,
    channel: mapChannel(x.channel),
    sender: x.sender,
    subject: x.subject,
    bodyPreview: x.bodyPreview,
    date: dto.date,
  }));
}

export type ApiQuizAnswerRequest = {
  quizItemId: string;
  answerIsPhishing: boolean;
};

export type ApiQuizAnswerResponse = {
  correct: boolean;
  pointsAwarded: number;
  totalPoints: number;
  currentStreakDays: number;
  bestStreakDays: number;
  explanationTitle?: string | null;
  explanationText: string;
};
