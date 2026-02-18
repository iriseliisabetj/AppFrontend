import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/auth/logout";

import { PrimaryLinkButton, SecondaryLinkButton } from "../components/ui/Buttons";
import { Pill } from "../components/ui/Pill";
import { StatCard } from "../components/ui/StatCard";
import { Feature } from "../components/ui/Feature";
import { isAdminFromToken } from "../auth/helpers";

import { LeaderboardCard } from "../components/home/LeaderboardCard";
import { ForumPreviewCard } from "../components/home/ForumPreviewCard";

export default function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("access_token"));
  const isAdmin = isAdminFromToken();

  async function onLogout() {
    await logout();
    navigate("/");
    window.location.reload();
  }

  return (
    <div className="page">
      <div className="container">
        <header className="topbar">
          <Link className="brand" to="/">
            <span className="brand__logo" aria-hidden />
            <span>
              <div className="brand__title">Õngitsustõrje</div>
              <div className="brand__subtitle">Igapäevane mini-treening e-kirjade ja SMSide vastu</div>
            </span>
          </Link>

          <nav className="nav">
            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  <PrimaryLinkButton to="/admin/quizzes">
                    Halda viktoriine
                  </PrimaryLinkButton>
                ) : (
                  <PrimaryLinkButton to="/quiz/today">
                    Tänane viktoriin
                  </PrimaryLinkButton>
                )}

                <PrimaryLinkButton to="/profile">
                  Minu tulemused
                </PrimaryLinkButton>

                <button className="btn btn--ghost" onClick={onLogout}>
                  Logi välja
                </button>
              </>
            ) : (
              <>
                <SecondaryLinkButton to="/auth/login">
                  Logi sisse
                </SecondaryLinkButton>

                <PrimaryLinkButton to="/auth/register">
                  Loo konto
                </PrimaryLinkButton>
              </>
            )}
          </nav>
        </header>

        <section className="hero">
          <div className="card">
            <div className="pills">
              <Pill>⏱ 2–3 min päevas</Pill>
              <Pill>📩 3 eelvaadet iga päev</Pill>
              <Pill>🧠 Õpid mustreid, mitte “õigeid vastuseid”</Pill>
            </div>

            <h1 className="hero__title">
              Õpi ära tundma <span className="hero__underline">õngitsus</span> enne, kui see sind kätte saab.
            </h1>

            <p className="hero__text">
              Sinu ülesanne on lihtne: iga päev näed <b>3 sõnumi eelvaadet</b> (e-kiri või SMS). Igaühe kohta otsustad,
              kas see on <b>õngitsus</b> või <b>turvaline</b>. Kohe pärast vastust saad lühikese selgituse, millised
              “punased lipud” olid usaldust lõhkuvad.
            </p>

            <div className="row">
              {isLoggedIn ? (
                <>
                  <PrimaryLinkButton to="/quiz/today">Alusta tänast treeningut</PrimaryLinkButton>
                  <SecondaryLinkButton to="/profile">Vaata statistikat</SecondaryLinkButton>
                </>
              ) : (
                <>
                  <PrimaryLinkButton to="/auth/register">Liitu</PrimaryLinkButton>
                  <SecondaryLinkButton to="/auth/login">Mul on juba konto</SecondaryLinkButton>
                </>
              )}
            </div>

            <div className="help" style={{ marginTop: 16 }}>
              NB! Treening on mõeldud teadlikkuse tõstmiseks. Ära sisesta päris paroole ega isikuandmeid kahtlastesse
              keskkondadesse.
            </div>
          </div>

          <div className="grid">
            <StatCard title="Päeva formaat" value="3 eelvaadet" hint="Iga päev uus komplekt." />
            <StatCard title="Otsus" value="Õngitsus / mitte" hint="Õpid kiiret mustrituvastust." />
            <StatCard title="Tagasiside" value="Kohe" hint="Selgitus, miks see oli usaldusväärne või kahtlane." />
          </div>
        </section>

        <section className="mid">
          <LeaderboardCard isLoggedIn={isLoggedIn} />
          <ForumPreviewCard />
        </section>

        <section style={{ marginTop: 18 }}>
          <div className="card card--soft">
            <h2 className="card__title">Mida see treening arendab?</h2>

            <div className="features">
              <Feature
                title="Mustrid ja heuristikad"
                text="Õpid ära tundma tüüpilised õngitsuse võtted: surve, autoriteet, vale turvatunne, linkide varjamine."
              />
              <Feature
                title="Kiire otsustus"
                text="Harjutad sama olukorda, mis päriselus: otsus tehakse “eelseisundis”, enne kui sa klikid."
              />
              <Feature
                title="Foorum: päris kogemused"
                text="Jaga oma kokkupuuteid andmepüügiga ja loe teiste lugusid. Soovi korral saad postitada oma nimega või anonüümselt."
              />
            </div>

            <div className="help" style={{ marginTop: 14 }}>
              Tipp: kui miski tekitab “kiire tegutsemise” tunde (ähvardus, trahv, konto lukustus), siis see on sageli
              signaal aeg maha võtta ja kontrollida.
            </div>
          </div>
        </section>

        <section style={{ marginTop: 18 }}>
          <div className="cta">
            <div>
              <div className="cta__title">Tee 3 otsust päevas. Tee vähem vigu päriselus.</div>
              <div className="cta__text">Alusta tänase komplektiga ja vaata, mis sind kõige rohkem “lõksu” tõmbab.</div>
            </div>

            {isLoggedIn ? (
              <Link className="btn" to="/quiz/today" style={{ background: "white", color: "#111", border: "none" }}>
                Alusta nüüd <span aria-hidden>→</span>
              </Link>
            ) : (
              <Link className="btn" to="/auth/register" style={{ background: "white", color: "#111", border: "none" }}>
                Loo konto <span aria-hidden>→</span>
              </Link>
            )}
          </div>

          <div className="footerNote">
            © {new Date().getFullYear()} Õngitsustõrje — lõputöö prototüüp. Sisu on hariduslik ja võib sisaldada
            simuleeritud näiteid.
          </div>
        </section>
      </div>
    </div>
  );
}
