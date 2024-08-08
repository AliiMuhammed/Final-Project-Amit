import React from "react";
import "./style/about.css";
import AboutSection from "./../../Shared/AboutSection";
import aboutImage from "./../../Assets/About/about-section.png";
import VideoSection from "./components/VideoSection";
import FeaturesSection from "./components/FeaturesSection";
import Info from "./components/Info";
import Testimonials from "../../Shared/Testimonials/Testimonials";
const About = () => {
  return (
    <section className="about">
      <AboutSection image={aboutImage} />
      <VideoSection />
      <FeaturesSection />
      <Info />
      <Testimonials />
    </section>
  );
};

export default About;
