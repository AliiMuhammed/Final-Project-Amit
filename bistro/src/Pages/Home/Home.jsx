import React from "react";
import Hero from "./Components/Hero";
import Menu from "./Components/Menu/Menu";
import "./Style/home.css";
import About from "./Components/About";
import Services from "./Components/Services/Services";
import Delivery from "./Components/Delivery";
import Testimonials from "./Components/Testimonials/Testimonials";
const Home = () => {
  return (
    <section className="home-section">
      <Hero />
      <Menu />
      <About />
      <Services />
      <Delivery />
      <Testimonials />
    </section>
  );
};

export default Home;
