import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../api/logout";
import { isAdminFromToken } from "../../auth/helpers";
import { useEffect, useRef, useState } from "react";
import { fetchMyProfile } from "../../api/profile";

export function Header() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("access_token"));
  const isAdmin = isAdminFromToken();

  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  async function onLogout() {
    await logout();
    setMenuOpen(false);
    setUsername(null);
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

  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      if (!isLoggedIn) {
        setUsername(null);
        return;
      }

      try {
        const me = await fetchMyProfile();
        if (!cancelled) {
          setUsername(me.username);
        }
      } catch {
        if (!cancelled) {
          setUsername(null);
        }
      }
    }

    loadMe();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

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
          {isLoggedIn && username && (
            <div className="headerGreeting">
              Tere, <b>{username}</b>!
            </div>
          )}

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
                    Minu profiil
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