import type { UiPreview } from "../../types/quiz";
import type { PreviewTemplateId } from "./templates";
import "./previews.css";

export function PreviewTemplate({
  template,
  data,
  onClick,
}: {
  template: PreviewTemplateId;
  data: UiPreview;
  onClick?: () => void;
}) {
  if (template === "imessage") return <IMessagePreview data={data} onClick={onClick} />;
  return <GmailEmailPreview data={data} onClick={onClick} />;
}

function GmailEmailPreview({ data, onClick }: { data: UiPreview; onClick?: () => void }) {
  const senderInitial = (data.sender?.[0] ?? "?").toUpperCase();
  const senderName = data.sender ?? "Saatja";
  const senderEmail = `${(data.sender ?? "sender").toLowerCase().replace(/\s+/g, ".")}@gmail.com`;

  return (
    <div className="pv pv--gmailOpen" role={onClick ? "button" : undefined} onClick={onClick}>
      <div className="gWrap">
        <div className="gHeader">
          <div className="gAvatar">{senderInitial}</div>

          <div className="gFrom">
            <div className="gFromLine">
              <div className="gName">{senderName}</div>
              <div className="gEmail">&lt;{senderEmail}&gt;</div>
            </div>

            <div className="gToRow">
              <span className="gToText">to me</span>
              <span className="gCaret" aria-hidden>
                ▾
              </span>
            </div>
          </div>

          <div className="gTime">{data.date ? "19:43" : "täna"}</div>
        </div>

        <div className="gBodyOuter">
          <div className="gBodyCard">
            <div className="gSubject">{data.subject ?? "(ilma pealkirjata)"}</div>
            <div className="gBodyText">{data.bodyPreview}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IMessagePreview({ data, onClick }: { data: UiPreview; onClick?: () => void }) {
  const senderInitial = (data.sender?.[0] ?? "?").toUpperCase();
  const senderName = data.sender ?? "Saatja";

  return (
    <div className="pv pv--imessageDark" role={onClick ? "button" : undefined} onClick={onClick}>
      <div className="iTop">
        <div className="iLeft">
          <span className="iBack" aria-hidden>
            ‹
          </span>
          <div className="iAvatar">{senderInitial}</div>
          <div className="iTitle">
            <div className="iSender">{senderName}</div>
            <div className="iMeta">SMS</div>
          </div>
        </div>

        <div className="iActions">
          <span className="iIcon" aria-hidden>
            ☎︎
          </span>
          <span className="iIcon" aria-hidden>
            ⓘ
          </span>
        </div>
      </div>

      <div className="iThread">
        <div className="iStamp">Täna</div>

        <br/><br/><br/><br/><br/>

        <div className="iBubble iBubble--in">
          <div className="iText">{data.bodyPreview}</div>
          <div className="iBubbleMeta">{data.date ?? "—"}</div>
        </div>
      </div>

      <div className="iComposer" aria-hidden>
        <div className="iPlus">＋</div>
        <div className="iInput">iMessage</div>
        <div className="iSend">↑</div>
      </div>
    </div>
  );
}