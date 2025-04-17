import "../../styles/mobileMenu.scss";

const MobileMenu = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <nav aria-label="Mobile menu" className="mobile-menu">
      <ul role="list">
        {["Featured", "Latest"].map((item) => (
          <li
            key={item}
            className={`mobile-menu__item ${
              activeTab === item ? "active" : ""
            }`}
            onClick={() => setActiveTab(item)}
            aria-selected={activeTab === item}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveTab(item);
              }
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileMenu;
