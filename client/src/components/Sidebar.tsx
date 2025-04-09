import { NavLink } from "react-router-dom";
import "../styles/sidebar.scss";
import { categories } from "../utils/categoryData";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        {categories.map((cat) => (
          <li key={cat.name}>
            <NavLink
              to={cat.path}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span className="sidebar-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
