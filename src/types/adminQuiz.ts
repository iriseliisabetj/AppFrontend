export type AdminChannel = 1 | 2;

export type AdminQuizItemDraft = {
  id?: string;
  channel: AdminChannel;
  sender: string;
  emailAddress?: string;
  subject?: string;
  smsPreview?: string;
  htmlBody?: string;
  isPhishing: boolean;
  explanationTitle: string;
  explanationText: string;
};

export type AdminQuizDraft = {
  date: string;
  items: AdminQuizItemDraft[];
};

export type AdminQuizUpdateItemDraft = AdminQuizItemDraft & {
  id: string;
};

export type AdminQuizUpdateDraft = {
  items: AdminQuizUpdateItemDraft[];
};
