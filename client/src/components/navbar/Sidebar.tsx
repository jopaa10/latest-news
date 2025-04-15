import "../../styles/sidebar.scss";
import { NavLink } from "react-router-dom";
import { categories } from "../../utils/categoryData";
import { Bookmarks } from "../../assets/icons";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const { isLoggedIn } = useAuth();
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
  }, [isLoggedIn]);

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <ul role="list">
        {categoriesState.map((cat) => (
          <li key={cat.name} role="listitem">
            <NavLink
              to={cat.path}
              className={({ isActive }) => (isActive ? "active" : "")}
              aria-label={`Navigate to ${cat.name}`}
            >
              <span className="sidebar-icon" aria-hidden={"true"}>
                {cat.icon}
              </span>
              <p>{cat.name}</p>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
