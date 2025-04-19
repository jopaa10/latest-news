import { useState } from "react";
import { Eye, EyeOff, Check, Close } from "../../assets/icons";
import { PasswordFieldProps } from "../../types/loginTypes";

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  showChecklist = false,
  setPasswordRules,
  required = true,
  passwordRules,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const handleChange = (val: string) => {
    if (val.length === 0) {
      setHasStartedTyping(false);
    } else if (!hasStartedTyping) {
      setHasStartedTyping(true);
    }

    onChange(val);
    setPasswordRules({
      length: val.length >= 8,
      upper: /[A-Z]/.test(val),
      lower: /[a-z]/.test(val),
      special: /[!@#$%^&*()[\]{};:'",.<>/?\\|`~+=_-]/.test(val),
    });
  };

  return (
    <>
      <div className="input-container">
        <label htmlFor={id}>{label}</label>

        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={id}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          required={required}
          aria-required={required}
          aria-describedby={`${id}-password-description`}
        />
        <button
          type="button"
          className="password"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {showChecklist && hasStartedTyping && (
        <ul
          className="password-checklist"
          aria-live="polite"
          role="list"
          id={`${id}-password-description`}
        >
          <li className={passwordRules.length ? "valid" : ""}>
            {passwordRules.length ? (
              <Check aria-hidden="true" />
            ) : (
              <Close aria-hidden="true" />
            )}
            <span>At least 8 characters</span>
          </li>
          <li className={passwordRules.upper ? "valid" : ""}>
            {passwordRules.upper ? (
              <Check aria-hidden="true" />
            ) : (
              <Close aria-hidden="true" />
            )}
            <span>One uppercase letter</span>
          </li>
          <li className={passwordRules.lower ? "valid" : ""}>
            {passwordRules.lower ? (
              <Check aria-hidden="true" />
            ) : (
              <Close aria-hidden="true" />
            )}
            <span>One lowercase letter</span>
          </li>
          <li className={passwordRules.special ? "valid" : ""}>
            {passwordRules.special ? (
              <Check aria-hidden="true" />
            ) : (
              <Close aria-hidden="true" />
            )}
            <span>One special character</span>
          </li>
        </ul>
      )}
    </>
  );
}
