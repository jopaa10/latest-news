import { useState } from "react";
import "../../styles/hero.scss";
import Modal from "../Modal";
import { useAuth } from "../../context/AuthContext";
import { Logout, User } from "../../assets/icons";

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
            <p>No, thanks</p>
            <button>Get</button>
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
                aria-label="Click to login"
              >
                <span>
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
