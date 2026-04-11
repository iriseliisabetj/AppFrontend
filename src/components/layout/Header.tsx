import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../api/logout";
import { isAdminFromToken } from "../../auth/helpers";
import { useEffect, useRef, useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("access_token"));
  const isAdmin = isAdminFromToken();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  async function onLogout() {
    await logout();
    setMenuOpen(false);
    navigate("/");
    window.location.reload();
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className="headerShell">
      <header className="topbar">
        <Link className="brand" to="/" onClick={closeMenu}>
          <img
            className="brand__logo"
            src="/badges/phishing.png"
            alt="Õngitsus logo"
          />
          <span>
            <div className="brand__title">Õngitsustõrje</div>
            <div className="brand__subtitle">
              Igapäevane treening õngitsuste vastu
            </div>
          </span>
        </Link>

        <div className="headerMenu" ref={menuRef}>
          <button
            type="button"
            className="burgerBtn"
            aria-label="Ava menüü"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((x) => !x)}
          >
            <span className="burgerBtn__line" />
            <span className="burgerBtn__line" />
            <span className="burgerBtn__line" />
          </button>

          {menuOpen && (
            <div className="burgerMenu">
              <Link
                className="burgerMenu__item"
                to="/"
                onClick={closeMenu}
              >
                Avaleht
              </Link>
              
              <Link
                className="burgerMenu__item"
                to="/forum"
                onClick={closeMenu}
              >
                Foorum
              </Link>
              {isLoggedIn ? (
                <>
                  {isAdmin ? (
                    <Link
                      className="burgerMenu__item"
                      to="/admin/quizzes"
                      onClick={closeMenu}
                    >
                      Halda viktoriine
                    </Link>
                  ) : null}

                  <Link
                    className="burgerMenu__item"
                    to="/profile"
                    onClick={closeMenu}
                  >
                    Minu tulemused
                  </Link>

                  <button
                    type="button"
                    className="burgerMenu__item burgerMenu__item--button"
                    onClick={onLogout}
                  >
                    Logi välja
                  </button>
                </>
              ) : (
                <>

                  <Link
                    className="burgerMenu__item"
                    to="/auth/login"
                    onClick={closeMenu}
                  >
                    Logi sisse
                  </Link>

                  <Link
                    className="burgerMenu__item"
                    to="/auth/register"
                    onClick={closeMenu}
                  >
                    Loo konto
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}