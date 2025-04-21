import { useNavigate } from "react-router-dom";
import { Button } from "./common/Button";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found">
      <h1>404 - Not Found</h1>
      <p>Sorry, we couldn’t find the page you were looking for.</p>
      <Button
        ariaLabel="go to home"
        onClick={() => navigate("/")}
        textColor="#000"
      >
        Go to Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
