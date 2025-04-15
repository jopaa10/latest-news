import "../../styles/modal.scss";
import { useEffect, useRef, useState } from "react";
import ModalWave from "../../assets/icons/ModalWave";
import { validateEmail } from "../../utils/validateEmailPass";
import { login, register, resendVerification } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { ModalProps } from "../../types/LoginTypes";
import InputField from "../common/InputField";
import PasswordField from "../common/PasswordField";

const Modal = ({ closeModal }: ModalProps) => {
  const modalRef = useRef<HTMLFormElement>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    upper: false,
    lower: false,
    special: false,
  });

  const { setToken } = useAuth();

  const handleClickOutside = (e: MouseEvent) => {
    if (
      modalRef.current &&
      e.target instanceof Node &&
      !modalRef.current.contains(e.target)
    ) {
      closeModal();
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    if (isRegister && (!name || !surname)) {
      setError("Name and surname are required for registration.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (
      isRegister &&
      (!passwordRules.length ||
        !passwordRules.upper ||
        !passwordRules.lower ||
        !passwordRules.special)
    ) {
      setError("Password must meet all requirements.");
      setLoading(false);
      return;
    }

    const body = isRegister
      ? { name, surname, email, password }
      : { email, password };

    try {
      const { data, ok } = isRegister
        ? await register(body)
        : await login(body);

      if (ok) {
        setToken(data.token);
        closeModal();
      } else {
        if (data.error === "Email not verified") {
          setError("Email not verified. Sending new verification email...");

          await resendVerification(data.token, email);

          setError(
            "Verification email has been sent. Please check your inbox."
          );
        } else {
          setError(data.error || "Something went wrong");
        }
      }
    } catch (error) {
      console.log(error);

      setError("Failed to connect to the server: ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <div
      className="modal"
      role="dialog"
      aria-labelledby="modalTitle"
      aria-hidden="false"
      aria-modal="true"
      aria-label="Login/registration modal"
    >
      <form
        action={""}
        method="POST"
        className="modal__form"
        ref={modalRef}
        onSubmit={handleSubmit}
      >
        <ModalWave />

        <h2>{isRegister ? "Sign Up" : "Login"}</h2>
        <p>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <InputField
                id="surname"
                label="Surname"
                name="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </>
          )}

          <InputField
            id="email"
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={setPassword}
            showChecklist={isRegister}
            setPasswordRules={setPasswordRules}
            passwordRules={passwordRules}
          />

          <div className="switch-mode">
            <p>
              {isRegister
                ? "Already have an account?"
                : "Don’t have an account?"}{" "}
            </p>
            <button
              type="button"
              className="link-btn"
              onClick={() => setIsRegister(!isRegister)}
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
