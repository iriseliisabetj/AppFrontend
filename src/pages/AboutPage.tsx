import { PageLayout } from "../components/layout/PageLayout";

export default function AboutPage() {
  return (
    <PageLayout>
      <section style={{ marginBottom: 18 }}>
        <br />
      </section>

      <div className="grid" style={{ gap: 16 }}>
        {/* EESMÄRK */}
        <div className="card">
          <h1 className="card__title">Lehe eesmärk</h1>
          <p className="help">
            Rakenduse eesmärk on aidata kasutajatel õppida ära tundma
            andmepüügi katseid nii e-kirjade kui ka SMS-ide kaudu.
          </p>

          <p className="help">
            Selle asemel, et anda lihtsalt teooriat, keskendub rakendus
            praktilisele õppimisele: näed reaalse elu näidetele
            sarnaseid sõnumeid ning pead otsustama, kas tegemist on
            õngitsusega või mitte.
          </p>

          <p className="help">
            Iga otsuse järel kuvatakse selgitus, mis aitab mõista,
            millised tunnused viitasid õngitsusele.
          </p>
        </div>

        {/* KUIDAS KASUTADA */}
        <div className="card">
          <h2 className="card__title" style={{ marginBottom: 14 }}>
            Kuidas kasutada
          </h2>

          <div className="grid" style={{ gap: 12 }}>
            <div className="lbRow">
              <div className="badge">1</div>
              <div className="lbRow__name">
                Ava päevane viktoriin
                <div className="help">
                  Iga päev on saadaval 3 uut sõnumit.
                </div>
              </div>
            </div>

            <div className="lbRow">
              <div className="badge">2</div>
              <div className="lbRow__name">
                Analüüsi sõnumit
                <div className="help">
                  Vaata saatjat, linke, teksti stiili ja sisu.
                </div>
              </div>
            </div>

            <div className="lbRow">
              <div className="badge">3</div>
              <div className="lbRow__name">
                Tee otsus
                <div className="help">
                  Vali, kas tegemist on õngitsusega või mitte.
                </div>
              </div>
            </div>

            <div className="lbRow">
              <div className="badge">4</div>
              <div className="lbRow__name">
                Õpi selgitusest
                <div className="help">
                  Pärast vastamist näed, mis oli kahtlane või usaldusväärne.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MIDA ÕPID */}
        <div className="card">
          <h2 className="card__title">Õngitsuse tunnused, mida meeles pidada</h2>

          <ul className="help" style={{ marginTop: 10 }}>
            <li>Kahtlased lingid ja domeenid</li>
            <li>Võltsitud saatjad</li>
            <li>Ajaline surve ja hirmutamine</li>
          </ul>
        </div>

        {/* MÄNGUSTUS */}
        <div className="card">
          <h2 className="card__title">Mängulisus</h2>

          <p className="help">
            Rakendus kasutab mängustamise elemente, et hoida õppimine
            motiveerivana ja aidata järjepidevust säilitada:
          </p>

          <ul className="help" style={{ marginTop: 10 }}>
            <li>Punktid õigete vastuste eest</li>
            <li>Streak ehk järjestikuste aktiivsete päevade arv</li>
            <li>Edetabel</li>
            <li>Märgid</li>
            <li>Koondtulemus viktoriini lõpus</li>
            <li>Edenemise nägemine enda profiilil</li>
          </ul>
        </div>

        {/* MIKS SEE ON OLULINE */}
        <div className="card">
          <h2 className="card__title">Miks see on oluline</h2>

          <p className="help">
            Andmepüük on üks levinumaid küberrünnakute vorme ning
            sageli piisab vaid ühest valest klikist, et sattuda pettuse ohvriks.
          </p>

          <p className="help">
            Selle rakenduse eesmärk ei ole õpetada pähe konkreetseid näiteid,
            vaid arendada oskust märgata mustreid ja ohumärke igapäevases
            digisuhtluses.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}