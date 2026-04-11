import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer style={{ marginTop: 18 }}>
      <div className="cta">
        <div>
          <div className="cta__title">Tee 3 otsust päevas. Tee vähem vigu päriselus.</div>
          <div className="cta__text">Alusta tänase komplektiga ja vaata, mis sind kõige rohkem “lõksu” tõmbab.</div>
        </div>

        <Link
          className="btn"
          to="/about"
          style={{ background: "white", color: "#111", border: "none" }}
        >
          Lehest <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="footerNote">
        © {new Date().getFullYear()} Õngitsustõrje — lõputöö prototüüp.
      </div>
    </footer>
  );
}