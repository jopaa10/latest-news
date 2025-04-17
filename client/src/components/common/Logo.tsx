import { useNavigate } from "react-router-dom";

const Logo = ({ isChecked = false }: { isChecked: boolean }) => {
  const navigate = useNavigate();

  return (
    <button
      className={`logo ${isChecked ? "logo--checked" : ""}`}
      onClick={() => navigate("/")}
      aria-label="Go to homepage"
    >
      <h1 className="red">My</h1>
      <h1 className="black">News</h1>
    </button>
  );
};

export default Logo;
