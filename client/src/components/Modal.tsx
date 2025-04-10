import { useEffect, useRef, useState } from "react";
import ModalWave from "../assets/icons/ModalWave";
import "../styles/modal.scss";

const Modal = ({ closeModal }: { closeModal: () => void }) => {
  const [isRegister, setIsRegister] = useState(false);
  const modalRef = useRef<HTMLFormElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      modalRef.current &&
      e.target instanceof Node &&
      !modalRef.current.contains(e.target)
    ) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="modal"
      role="dialog"
      aria-labelledby="modalTitle"
      aria-hidden="false"
    >
      <form action={""} method="POST" className="modal__form" ref={modalRef}>
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
              <div className="input-container">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" />
              </div>

              <div className="input-container">
                <label htmlFor="surname">Surname</label>
                <input type="text" id="surname" name="surname" />
              </div>
            </>
          )}

          <div className="input-container">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
          </div>

          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
          </div>
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

          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Modal;
