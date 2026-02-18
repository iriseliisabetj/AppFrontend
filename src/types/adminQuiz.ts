export type AdminChannel = 1 | 2;

export type AdminQuizItemDraft = {
  channel: AdminChannel;
  sender: string;
  subject: string;
  bodyPreview: string;
  isPhishing: boolean;
  explanationTitle: string;
  explanationText: string;
};

export type AdminQuizDraft = {
  date: string;
  items: AdminQuizItemDraft[];
};
