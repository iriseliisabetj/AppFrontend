import type { ApiError } from "../../auth/authUtils";

export function ApiErrorAlert({
  title,
  error,
}: {
  title: string;
  error: ApiError;
}) {
  return (
    <div className="alert alert--error">
      <div style={{ fontWeight: 900, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, opacity: 0.9 }}>
        {error.status ? `HTTP ${error.status}` : ""} {error.message ?? ""}
      </div>
      {error.data != null && (
        <pre className="pre">{JSON.stringify(error.data, null, 2)}</pre>
      )}
    </div>
  );
}

export function DebugInfoAlert({ data }: { data: unknown }) {
  return (
    <div className="alert alert--info">
      <div style={{ fontWeight: 900, marginBottom: 6 }}>Info</div>
      <pre className="pre">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
