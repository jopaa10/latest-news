import { useEffect, useState } from "react";
import SearchBar from "../SearchBar";
import { NavLink } from "react-router-dom";
import { categories } from "../../utils/categoryData";
import { Bookmarks, Logout, User } from "../../assets/icons";
import { useAuth } from "../../context/AuthContext";
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
        }`}
      >
        {isLoggedIn ? (
          <>
            <p>Welcome, {username}</p>
            <button onClick={handleLogout}>
              <span>
                <Logout />
              </span>
            </button>
          </>
        ) : (
          <button onClick={handleOpenModal}>
            <span>
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
        />
        <label htmlFor="navi-toggle" className="navbar__button">
          <span className="navbar__icon">&nbsp;</span>
        </label>

        <div
          className="navbar__background"
          style={{
            position: !startedScrolling ? "fixed" : "absolute",
            top: startedScrolling ? "-2rem" : "",
          }}
        >
          &nbsp;
        </div>

        <nav className={`navbar__nav ${isChecked ? "navbar__nav--open" : ""}`}>
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
                  <p>{cat.name}</p>
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
