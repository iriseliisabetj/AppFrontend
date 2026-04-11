import { useRef } from "react";

type HtmlEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function HtmlEditor({ value, onChange }: HtmlEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function insertText(snippet: string) {
    const el = textareaRef.current;
    if (!el) {
      onChange(value + snippet);
      return;
    }

    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;

    const next =
      value.slice(0, start) +
      snippet +
      value.slice(end);

    onChange(next);

    requestAnimationFrame(() => {
      el.focus();
      const caret = start + snippet.length;
      el.setSelectionRange(caret, caret);
    });
  }

  return (
    <div className="htmlEditor">
      <div className="htmlEditor__toolbar">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => insertText("<p></p>")}
        >
          Lõik
        </button>

        <button
          type="button"
          className="btn btn--ghost"
          onClick={() =>
            insertText(
            '<img src="https://upload.wikimedia.org/wikipedia/commons/b/be/Lhv-logo_2.svg" align="center"></img>'
            )}
        >
          Pilt
        </button>

        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => insertText("<strong>rõhutatud tekst</strong>")}
        >
          Bold
        </button>

        <button
          type="button"
          className="btn btn--ghost"
          onClick={() =>
            insertText('<a href="https://example.com">Linktekst</a>')
          }
        >
          Link
        </button>

        <button
          type="button"
          className="btn btn--ghost"
          onClick={() =>
            insertText(
              '<p>Tere!</p><p>Palun kinnita oma konto: <a href="https://example.com">ava link</a></p>'
            )
          }
        >
          Näidis
        </button>
      </div>

      <textarea
        ref={textareaRef}
        className="input htmlEditor__textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="<p>Tere!</p><p>Palun ava <a href='https://example.com'>see link</a>.</p>"
      />
    </div>
  );
}