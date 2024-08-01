import React from "react";
import Hero from "./Components/Hero";
import Menu from "./Components/Menu/Menu";
import "./Style/home.css";
import About from "./Components/About";
const Home = () => {
  return (
    <section className="home-section">
      <Hero />
      <Menu />
      <About />
    </section>
  );
};

export default Home;
