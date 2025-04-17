import "../../styles/_utils.scss";
import { ButtonProps } from "../../types/buttonTypes";

export const Button = ({
  backgroundColor,
  textColor,
  onClick,
  ariaLabel,
  children,
  cls,
  type = "button",
}: ButtonProps) => {
  const buttonStyle = {
    backgroundColor: backgroundColor,
    color: textColor,
  };

  return (
    <button
      className={`custom-button ${cls}`}
      style={buttonStyle}
      onClick={onClick}
      aria-label={ariaLabel}
      type={type}
    >
      {children}
    </button>
  );
};
