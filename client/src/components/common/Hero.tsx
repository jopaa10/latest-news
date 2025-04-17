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
            <h1 className="title-medium">Make MyNews your homepage</h1>
            <p className="title-medium">
              Every day discover what’s trending on the internet!
            </p>
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
              ariaLabel="Get"
              backgroundColor="#fff"
              textColor="#000"
              type="button"
            >
              Get
            </Button>
            {isLoggedIn ? (
              <div className="logout-container">
                <p className="title-medium">Welcome, {username}</p>
                <button
                  className="logout"
                  onClick={handleLogout}
                  aria-label="Click to logout"
                >
                  <span aria-hidden="true">
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
