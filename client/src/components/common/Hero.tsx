import { useState } from "react";
import "../../styles/hero.scss";
import Modal from "../modal/LoginModal";
import { Logout, User } from "../../assets/icons";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "./Button";

const Hero = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { isLoggedIn, handleLogout, username } = useAuth();

  const handleOpenModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <div className="hero-wrapper">
        <div className="hero">
          <div className="hero__text">
            <h3>Make MyNews your homepage</h3>
            <p>Every day discover what’s trending on the internet!</p>
          </div>

          <div className="button-container">
            <Button
              type="button"
              textColor="#fff"
              backgroundColor="transparent"
              cls="skip-btn"
              onClick={() => console.log("User skipped onboarding")}
              ariaLabel="Dismiss homepage prompt"
            >
              No, thanks
            </Button>

            <Button
              ariaLabel="Get button"
              backgroundColor="#fff"
              textColor="#000"
              type="button"
            >
              Get
            </Button>
            {isLoggedIn ? (
              <div className="logout-container">
                <p>Welcome, {username}</p>
                <button className="logout" onClick={handleLogout}>
                  <span>
                    <Logout />
                  </span>
                </button>
              </div>
            ) : (
              <button
                className="login"
                onClick={handleOpenModal}
                aria-label="Open login modal"
              >
                <span aria-hidden="true">
                  <User />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {modalOpen && <Modal closeModal={() => setModalOpen(false)} />}
    </>
  );
};

export default Hero;
