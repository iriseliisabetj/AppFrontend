export type ApiError = { status?: number; message?: string; data?: unknown };

export function parseAxiosError(e: unknown): ApiError {
  const ex = e as {
    message?: string;
    response?: { status?: number; data?: unknown };
  };

  return {
    status: ex?.response?.status,
    message: ex?.message ?? "Tundmatu viga",
    data: ex?.response?.data,
  };
}

export type TokenPair = { accessToken: string | null; refreshToken: string | null };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function getString(obj: unknown, key: string): string | undefined {
  if (!isRecord(obj)) return undefined;
  const v = obj[key];
  return typeof v === "string" ? v : undefined;
}

function getRecord(obj: unknown, key: string): Record<string, unknown> | undefined {
  if (!isRecord(obj)) return undefined;
  const v = obj[key];
  return isRecord(v) ? v : undefined;
}

export function tryExtractTokens(data: unknown): TokenPair {
  const accessToken =
    getString(data, "accessToken") ??
    getString(data, "access_token") ??
    getString(data, "token") ??
    getString(data, "jwt") ??
    getString(getRecord(data, "access"), "token") ??
    getString(getRecord(data, "data"), "accessToken") ??
    null;

  const refreshToken =
    getString(data, "refreshToken") ??
    getString(data, "refresh_token") ??
    getString(data, "refresh") ??
    getString(getRecord(data, "refresh"), "token") ??
    getString(getRecord(data, "data"), "refreshToken") ??
    null;

  return { accessToken, refreshToken };
}

export function storeTokens(tokens: TokenPair) {
  if (tokens.accessToken) localStorage.setItem("access_token", tokens.accessToken);
  if (tokens.refreshToken) localStorage.setItem("refresh_token", tokens.refreshToken);
}
