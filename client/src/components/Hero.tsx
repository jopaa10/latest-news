import "../styles/Hero.scss";

const Hero = () => {
  return (
    <div className="hero-wrapper">
      <div className="hero">
        <div className="hero__text">
          <h3>Make MyNews your homepage</h3>
          <p>Every day discover what’s trending on the internet!</p>
        </div>
        <div className="button-container">
          <p>No, thanks</p>
          <button>Get</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
