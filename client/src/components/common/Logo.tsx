import { useNavigate } from "react-router-dom";

const Logo = ({ isChecked = false }: { isChecked: boolean }) => {
  const navigate = useNavigate();

  return (
    <button
      className={`logo ${isChecked ? "logo--checked" : ""}`}
      onClick={() => navigate("/")}
    >
      <span className="red">My</span>
      <span className="black">News</span>
    </button>
  );
};

export default Logo;
