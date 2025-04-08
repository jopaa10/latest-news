import { NavLink } from "react-router-dom";
import {
  Briefcase,
  Description,
  HealthAndSafety,
  Home,
  Science,
  SportsSoccer,
  Tv,
} from "../assets/icons";
import "../styles/sidebar.scss";

const categories = [
  { name: "Home", icon: <Home />, path: "/" },
  { name: "General", icon: <Description />, path: "/general" },
  { name: "Business", icon: <Briefcase />, path: "/business" },
  { name: "Health", icon: <HealthAndSafety />, path: "/health" },
  { name: "Science", icon: <Science />, path: "/science" },
  { name: "Sports", icon: <SportsSoccer />, path: "/sports" },
  { name: "Technology", icon: <Tv />, path: "/technology" },
];
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
