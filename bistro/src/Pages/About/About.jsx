import React from "react";
import "./style/about.css";
import AboutSection from "./../../Shared/AboutSection";
import aboutImage from "./../../Assets/About/about-section.png";
const About = () => {
  return (
    <section className="about">
      <AboutSection image={aboutImage} />
    </section>
  );
};

export default About;
