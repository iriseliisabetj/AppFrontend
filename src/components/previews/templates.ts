import type { UiPreview } from "../../types/quiz";

export type PreviewTemplateId = "gmail" | "imessage";

export function defaultTemplateFor(channel: UiPreview["channel"]): PreviewTemplateId {
  return channel === "SMS" ? "imessage" : "gmail";
}
