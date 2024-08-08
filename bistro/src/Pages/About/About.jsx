import React from "react";
import "./style/about.css";
import AboutSection from "./../../Shared/AboutSection";
import aboutImage from "./../../Assets/About/about-section.png";
import VideoSection from "./components/VideoSection";
const About = () => {
  return (
    <section className="about">
      <AboutSection image={aboutImage} />
      <VideoSection />
    </section>
  );
};

export default About;
