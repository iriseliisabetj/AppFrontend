export type ApiTodayQuiz = {
  date: string;
  items: ApiQuizItem[];
};

export type ApiQuizItem = {
  id: string;
  channel: number;
  sender: string;
  emailAddress?: string | null;
  subject: string;
  smsPreview?: string | null;
  htmlBody?: string | null;
};

export type UiChannel = "EMAIL" | "SMS";

export type UiPreview = {
  id: string;
  channel: UiChannel;
  sender: string;
  emailAddress?: string | null;
  subject?: string;
  smsPreview?: string | null;
  htmlBody?: string | null;
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
    emailAddress: x.emailAddress ?? null,
    subject: x.subject,
    smsPreview: x.smsPreview ?? null,
    htmlBody: x.htmlBody ?? null,
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
