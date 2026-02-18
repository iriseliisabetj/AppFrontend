import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { ApiErrorAlert, DebugInfoAlert } from "../../components/ui/ApiAlerts";
import { parseAxiosError, storeTokens, tryExtractTokens } from "../../auth/authUtils";
import type { ApiError } from "../../auth/authUtils";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("Test123!");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [debugOut, setDebugOut] = useState<unknown>(null);

  const isValid = useMemo(() => email.trim().length > 3 && password.length >= 6, [email, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || isLoading) return;

    setIsLoading(true);
    setError(null);
    setDebugOut(null);

    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      storeTokens(tryExtractTokens(data));

      if (!localStorage.getItem("access_token")) {
        setDebugOut({
          info: "Login õnnestus, aga access tokenit ei leitud response'ist. Kontrolli Swaggerist võtmenimesid.",
          raw: data,
        });
        return;
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
        <div className="authLayout">
          <div className="authSide">
            <h1 style={{ fontSize: 40, margin: 0 }}>Tere tulemast tagasi 👋</h1>
            <p style={{ marginTop: 16, fontSize: 18, opacity: 0.8 }}>
              Logi sisse ja jätka oma igapäevast 3-eelvaate treeningut.
            </p>
            <div className="help" style={{ marginTop: 20 }}>
              Õngitsustõrje on lõputöö prototüüp, mis aitab sul arendada kiiret mustrituvastust ja vähendada riskikäitumist.
            </div>
          </div>

          <div className="card authCard">
            <h2 className="card__title">Logi sisse</h2>

            <form className="form" onSubmit={onSubmit}>
              <label className="field">
                <span className="label">E-post</span>
                <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>

              <label className="field">
                <span className="label">Parool</span>
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </label>

              <button className="btn btn--primary" type="submit" disabled={!isValid || isLoading}>
                {isLoading ? "Sisselogimine..." : "Logi sisse"}
              </button>

              <div className="row" style={{ justifyContent: "space-between" }}>
                <Link className="link" to="\">
                  ← Avaleht
                </Link>
                <Link className="link" to="/auth/register">
                  Registreeru
                </Link>
              </div>
            </form>

            {error && <ApiErrorAlert title="Sisselogimine ebaõnnestus" error={error} />}
            {debugOut != null && <DebugInfoAlert data={debugOut} />}
          </div>
        </div>
      </div>
    </div>
  );
}
