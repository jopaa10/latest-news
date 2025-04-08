import "../../styles/mobileMenu.scss";

const MobileMenu = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <ul className="mobile-menu">
      {["Featured", "Latest"].map((item) => (
        <li
          key={item}
          className={`mobile-menu__item ${activeTab === item ? "active" : ""}`}
          onClick={() => setActiveTab(item)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export default MobileMenu;
