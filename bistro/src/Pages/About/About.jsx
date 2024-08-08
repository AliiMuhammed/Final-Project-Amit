import React from "react";
import "./style/about.css";
import AboutSection from "./../../Shared/AboutSection";
import aboutImage from "./../../Assets/About/about-section.png";
import VideoSection from "./components/VideoSection";
import FeaturesSection from "./components/FeaturesSection";
import Info from "./components/Info";
const About = () => {
  return (
    <section className="about">
      <AboutSection image={aboutImage} />
      <VideoSection />
      <FeaturesSection />
      <Info />
    </section>
  );
};

export default About;
