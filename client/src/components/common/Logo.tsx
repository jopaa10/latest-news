import { useNavigate } from "react-router-dom";

const Logo = ({ isChecked = false }: { isChecked: boolean }) => {
  const navigate = useNavigate();

  return (
    <button
      className={`logo ${isChecked ? "logo--checked" : ""}`}
      onClick={() => navigate("/")}
      aria-label="Go to homepage"
    >
      <span className="red title-big" aria-hidden="true">
        My
      </span>
      <span className="black title-big" aria-hidden="true">
        News
      </span>
    </button>
  );
};

export default Logo;
