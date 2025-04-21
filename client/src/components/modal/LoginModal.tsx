import "../../styles/modal.scss";
import { useEffect, useRef, useState } from "react";
import ModalWave from "../../assets/icons/ModalWave";
import { validateEmail } from "../../utils/validateEmailPass";
import { login, register, resendVerification } from "../../api/auth";
import InputField from "../common/InputField";
import PasswordField from "../common/PasswordField";
import { useAuth } from "../../hooks/useAuth";
import { ModalProps } from "../../types/loginTypes";

const Modal = ({ closeModal }: ModalProps) => {
  const modalRef = useRef<HTMLFormElement>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    upper: false,
    lower: false,
    special: false,
  });

  const { setToken, markAsRegistered } = useAuth();

  const introRef = useRef<HTMLParagraphElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = () => {
    const { email, password, name, surname } = formData;
    if (!email || !password) {
      return "Email and password are required.";
    }
    if (isRegister && (!name || !surname)) {
      return "Name and surname are required for registration.";
    }
    if (!validateEmail(email)) {
      return "Please enter a valid email address.";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (
      isRegister &&
      (!passwordRules.length ||
        !passwordRules.upper ||
        !passwordRules.lower ||
        !passwordRules.special)
    ) {
      return "Password must meet all requirements.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setLoading(true);

    const { email, password, name, surname } = formData;
    const body = isRegister
      ? { name, surname, email, password }
      : { email, password };

    try {
      const { data, ok } = isRegister
        ? await register(body)
        : await login(body);

      if (ok) {
        setToken(data.token);
        if (isRegister) markAsRegistered();
        closeModal();
      } else if (data.error === "Email not verified") {
        setError("Email not verified. Sending new verification email...");
        await resendVerification(data.token, email);
        setError("Verification email sent. Please check your inbox.");
        setTimeout(() => resetForm(), 5000);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", surname: "", email: "", password: "" });
    setPasswordRules({
      length: false,
      upper: false,
      lower: false,
      special: false,
    });
    setError(null);
  };

  useEffect(() => {
    if (introRef.current) {
      introRef.current.focus();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isRegister]);

  return (
    <div
      className="modal"
      role="dialog"
      aria-labelledby="modalTitle"
      aria-describedby="modalDesc"
      aria-modal="true"
    >
      <form ref={modalRef} className="modal__form" onSubmit={handleSubmit}>
        <ModalWave />
        <h2 id="modalDesc">{isRegister ? "Sign Up" : "Login"}</h2>
        <p aria-hidden="true">
          {isRegister
            ? "Create an account to save your favorite articles"
            : "Login and save favorite articles"}
        </p>

        <p
          ref={introRef}
          tabIndex={-1}
          className="visually-hidden"
          aria-live="polite"
        >
          {isRegister
            ? "Create an account to save your favorite articles"
            : "Login and save favorite articles"}
        </p>

        <div className="modal__form__fields">
          {isRegister && (
            <>
              <InputField
                id="name"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <InputField
                id="surname"
                label="Surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
              />
            </>
          )}

          <InputField
            id="email"
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <PasswordField
            id="password"
            label="Password"
            value={formData.password}
            onChange={(val) => {
              setFormData({ ...formData, password: val });
              setError(null);
            }}
            showChecklist={isRegister && formData.password.length > 0}
            setPasswordRules={setPasswordRules}
            passwordRules={passwordRules}
          />

          <div className="switch-mode">
            <p>
              {isRegister
                ? "Already have an account?"
                : "Don’t have an account?"}
            </p>
            <button
              type="button"
              className="link-btn"
              onClick={() => setIsRegister((prev) => !prev)}
            >
              {isRegister ? "Login" : "Sign up"}
            </button>
          </div>

          <button className="submit" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>

          {error && <p className="error-message">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default Modal;
