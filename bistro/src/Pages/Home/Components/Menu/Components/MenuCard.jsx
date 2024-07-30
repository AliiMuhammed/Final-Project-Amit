import React from "react";
import "../Style/menu-card.css";
import { Link } from "react-router-dom";
const MenuCard = ({ icon, title, description }) => {
  return (
    <div className="menu-card">
      <div className="menu-card-icon">{icon}</div>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link to={"/menu"}>Explore Menu</Link>
    </div>
  );
};

export default MenuCard;
