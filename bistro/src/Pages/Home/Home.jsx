import React from "react";
import Hero from "./Components/Hero";
import Menu from "./Components/Menu/Menu";
import "./Style/home.css";
const Home = () => {
  return (
    <section className="home-section">
      <Hero />
      <Menu />
    </section>
  );
};

export default Home;
