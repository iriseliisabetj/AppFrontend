import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { ApiErrorAlert, DebugInfoAlert } from "../../components/ui/ApiAlerts";
import { parseAxiosError, storeTokens, tryExtractTokens } from "../../auth/authUtils";
import type { ApiError } from "../../auth/authUtils";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Username");
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("Test123!");
  const [confirmPassword, setConfirmPassword] = useState("Test123!");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [debugOut, setDebugOut] = useState<unknown>(null);

  const passwordsMatch = password === confirmPassword;

  const isValid = useMemo(
    () =>
      userName.trim().length > 0 &&
      email.trim().length > 3 &&
      password.length >= 6 &&
      passwordsMatch,
    [userName, email, password, passwordsMatch]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || isLoading) return;

    setIsLoading(true);
    setError(null);
    setDebugOut(null);

    try {
      const regRes = await api.post("/auth/register", { userName, email, password });
      const regData = regRes.data;

      storeTokens(tryExtractTokens(regData));

      if (!localStorage.getItem("access_token")) {
        const loginRes = await api.post("/auth/login", { email, password });
        const loginData = loginRes.data;

        storeTokens(tryExtractTokens(loginData));

        if (!localStorage.getItem("access_token")) {
          setDebugOut({
            info: "Registreerimine ja login õnnestusid, aga access tokenit ei leitud response'ist. Kontrolli Swaggerist võtmenimesid.",
            registerRaw: regData,
            loginRaw: loginData,
          });
          return;
        }
      }

      navigate("/");
    } catch (e: unknown) {
      setError(parseAxiosError(e));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page page--auth">
      <div className="container container--auth">
        <header className="authHeader">
          <Link className="link" to="/" style={{ fontWeight: 900, letterSpacing: -0.3 }}>
            Õngitsustõrje
          </Link>
          <Link className="link" to="/auth/login">
            Logi sisse
          </Link>
        </header>

        <div className="card" style={{ marginTop: 18 }}>
          <h1 style={{ margin: 0, fontSize: 28, letterSpacing: "-0.6px" }}>Loo konto</h1>
          <p className="card__lead">Konto abil saad iga päev uue komplekti ning sinu tulemused ja areng salvestuvad.</p>

          <form className="form" onSubmit={onSubmit}>
            <label className="field">
              <span className="label">Kasutajanimi</span>
              <input
                className="input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoComplete="username"
                placeholder="Nt MariTamm"
              />
            </label>

            <label className="field">
              <span className="label">E-post</span>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="nimi@domeen.ee"
              />
            </label>

            <label className="field">
              <span className="label">Parool</span>
              <input
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="Vähemalt 6 märki"
              />
            </label>

            <label className="field">
              <span className="label">Korda parooli</span>
              <input
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="Korda parooli"
              />
            </label>

            {!passwordsMatch && (
              <div style={{ fontSize: 13, fontWeight: 800, color: "#7a0000" }}>
                Paroolid ei kattu.
              </div>
            )}

            <button className="btn btn--primary" type="submit" disabled={!isValid || isLoading}>
              {isLoading ? "Registreerimine..." : "Loo konto"}
            </button>

            <div className="row" style={{ justifyContent: "space-between" }}>
              <Link className="link" to="/">
                ← Tagasi avalehele
              </Link>
              <Link className="link" to="/auth/login">
                Mul on konto → logi sisse
              </Link>
            </div>

            {error && <ApiErrorAlert title="Registreerimine ebaõnnestus" error={error} />}
            {debugOut != null && <DebugInfoAlert data={debugOut} />}
          </form>
        </div>

        <div className="help">Tipp: kasuta tugevat parooli ja ära kasuta sama parooli, mida kasutad päris kontodel.</div>
      </div>
    </div>
  );
}
