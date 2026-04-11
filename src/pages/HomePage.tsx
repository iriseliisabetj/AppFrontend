import { PrimaryLinkButton, SecondaryLinkButton } from "../components/ui/Buttons";
import { Pill } from "../components/ui/Pill";
import { Feature } from "../components/ui/Feature";
import { LeaderboardCard } from "../components/home/LeaderboardCard";
import { ForumPreviewCard } from "../components/home/ForumPreviewCard";
import { PageLayout } from "../components/layout/PageLayout";

export default function HomePage() {
  const isLoggedIn = Boolean(localStorage.getItem("access_token"));

  return (
    <PageLayout>
      <section>
        <div className="card">
          <div className="pills">
            <Pill>⏱ 2–3 min päevas</Pill>
            <Pill>📩 3 eelvaadet iga päev</Pill>
            <Pill>🧠 Harjutad kriitilist mõtlemist</Pill>
          </div>

          <h1 className="hero__title">
            Küberturvalisuse nõrgim lüli on <span className="hero__underline">inimene</span>
          </h1>

          <p className="hero__text">
            Sinu ülesanne on lihtne: iga päev näed <b>3 sõnumi eelvaadet</b>. Igaühe kohta otsustad,
            kas see on <b>õngitsus</b> või <b>mitte</b>. Kohe pärast vastust saad lühikese selgituse, mis viitas õngitsusele.
          </p>

          <div className="row">
            {isLoggedIn ? (
              <>
                <PrimaryLinkButton to="/quiz/today">Alusta tänast treeningut →</PrimaryLinkButton>
              </>
            ) : (
              <>
                <PrimaryLinkButton to="/auth/register">Liitu →</PrimaryLinkButton>
                <SecondaryLinkButton to="/auth/login">Mul on juba konto</SecondaryLinkButton>
              </>
            )}
          </div>
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
    </PageLayout>
  );
}