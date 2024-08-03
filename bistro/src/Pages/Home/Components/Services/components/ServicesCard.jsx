import React from "react";
import "../style/services-card.css";
const ServicesCard = ({ serviceImg, title, description }) => {
  return (
    <div className="services-card">
      <div className="service-img">
        <img loading="lazy" src={serviceImg} alt="serviceImage" />
      </div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default ServicesCard;
