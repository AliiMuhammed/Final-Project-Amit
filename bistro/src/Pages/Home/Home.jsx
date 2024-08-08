import React from "react";
import Hero from "./Components/Hero";
import Menu from "./Components/Menu/Menu";
import "./Style/home.css";
import Services from "./Components/Services/Services";
import Delivery from "./Components/Delivery";
import Testimonials from "./Components/Testimonials/Testimonials";
import Blog from "./Components/Blog/Blog";
import AboutSection from "../../Shared/AboutSection";
import aboutImg from "../../Assets/Home/about-section.png";

const Home = () => {
  return (
    <section className="home-section">
      <Hero />
      <Menu />
      <AboutSection image={aboutImg} />
      <Services />
      <Delivery />
      <Testimonials />
      <Blog />
    </section>
  );
};

export default Home;
