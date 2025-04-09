import { useEffect, useState } from "react";
import SearchBar from "../SearchBar";

import { NavLink } from "react-router-dom";
import { categories } from "../../utils/categoryData";

const MobileNavbar = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [startedScrolling, setStartedScrolling] = useState(false);

  useEffect(() => {
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
  }, [isChecked]);

  return (
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
          {categories.map((cat) => (
            <li key={cat.name}>
              <NavLink
                to={cat.path}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setIsChecked(false)}
              >
                <span className="sidebar-icon">{cat.icon}</span>
                <span>{cat.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default MobileNavbar;
