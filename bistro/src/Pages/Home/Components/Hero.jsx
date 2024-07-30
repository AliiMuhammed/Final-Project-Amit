import React from "react";
import { Link } from "react-router-dom";
import "../Style/hero.css";
const Hero = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <h1 className="main_heading">Best food for your taste</h1>
        <p>
          Discover delectable cuisine and unforgettable moments in our
          welcoming, culinary haven.
        </p>
        <div className="hero-btns">
          <Link to={"/"} className="main-btn">
            Book A Table
          </Link>
          <Link to={"/"} className="main-outline-btn">
            Explore Menu
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
