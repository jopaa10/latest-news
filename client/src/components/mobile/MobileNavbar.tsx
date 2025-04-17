import { useEffect, useState } from "react";
import SearchBar from "../search/SearchBar";
import { NavLink } from "react-router-dom";
import { categories } from "../../utils/categoryData";
import { Bookmarks, Logout, User } from "../../assets/icons";
import { useAuth } from "../../hooks/useAuth";
import Modal from "../modal/LoginModal";

const MobileNavbar = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [startedScrolling, setStartedScrolling] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { isLoggedIn, handleLogout, username } = useAuth();

  const [categoriesState, setCategoriesState] = useState(categories);

  useEffect(() => {
    if (isLoggedIn) {
      setCategoriesState([
        ...categories,
        { name: "Favorites", icon: <Bookmarks />, path: "/favorites" },
      ]);
    } else {
      setCategoriesState(categories);
    }
    const handleResizeOrScroll = () => {
      if (window.scrollY > 0 && !isChecked) {
        setStartedScrolling(true);
      } else {
        setStartedScrolling(false);
      }
    };

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll);

    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
    };
  }, [isChecked, isLoggedIn]);

  const handleOpenModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <div
        className={`login-container ${
          isLoggedIn ? "login-container--logged" : ""
        } ${isChecked ? "login-container--navbar-open" : ""}`}
      >
        {isLoggedIn ? (
          <>
            <p className="title-medium">Welcome, {username}</p>
            <button onClick={handleLogout} aria-label="Log out">
              <span aria-hidden="true">
                <Logout />
              </span>
            </button>
          </>
        ) : (
          <button onClick={handleOpenModal} aria-label="Open login modal">
            <span aria-hidden="true">
              <User />
            </span>
          </button>
        )}
      </div>
      <header className="navbar">
        <input
          type="checkbox"
          className="navbar__checkbox"
          id="navi-toggle"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          aria-controls="mobile-navigation"
          aria-expanded={isChecked}
        />
        <label
          htmlFor="navi-toggle"
          className={`navbar__button ${
            isChecked ? "navbar__button--open" : ""
          }`}
          aria-label={isChecked ? "Close menu" : "Open menu"}
        >
          <span className="navbar__icon" aria-hidden="true">
            &nbsp;
          </span>
        </label>

        <div
          className="navbar__background"
          style={{
            position: !startedScrolling ? "fixed" : "absolute",
            top: startedScrolling ? "-2rem" : "",
          }}
          aria-hidden="true"
        >
          &nbsp;
        </div>

        <nav
          id="mobile-navigation"
          role="navigation"
          aria-label="Mobile main menu"
          className={`navbar__nav ${isChecked ? "navbar__nav--open" : ""}`}
        >
          {isChecked && <SearchBar isChecked={isChecked} />}
          <ul className="navbar__list">
            {categoriesState.map((cat) => (
              <li key={cat.name}>
                <NavLink
                  to={cat.path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={() => setIsChecked(false)}
                >
                  <span className="sidebar-icon">{cat.icon}</span>
                  <p className="title-nav">{cat.name}</p>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {modalOpen && <Modal closeModal={() => setModalOpen(false)} />}
    </>
  );
};

export default MobileNavbar;
