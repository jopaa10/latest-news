import "../../styles/toast.scss";

const Toast = ({
  showToast,
  message,
  logoutCountdownDuration,
}: {
  showToast: boolean;
  message: string;
  logoutCountdownDuration: number;
}) => {
  if (!showToast) return null;
  return (
    <div className={`custom-toast ${showToast ? "visible" : ""}`}>
      <span>{message}</span>
      <div
        className="custom-toast__background"
        style={{ animationDuration: `${logoutCountdownDuration * 10}s` }}
      />
    </div>
  );
};

export default Toast;
