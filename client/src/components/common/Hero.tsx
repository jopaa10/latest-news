import { useState } from "react";
import "../../styles/hero.scss";
import Modal from "../Modal";

const Hero = () => {
  const [modalOpen, setModalOpen] = useState(false);

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
            <button onClick={handleOpenModal}>login</button>
          </div>
        </div>
      </div>

      {modalOpen && <Modal closeModal={() => setModalOpen(false)} />}
    </>
  );
};

export default Hero;
