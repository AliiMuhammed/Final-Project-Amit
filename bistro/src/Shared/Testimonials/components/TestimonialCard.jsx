import React from "react";
import "../style/testimonialCard.css";
const TestimonialCard = ({ title, description, name, address, img }) => {
  return (
    <div className="test-card">
      <h1>{`“${title}”`}</h1>
      <p>{description}</p>
      <div className="line-break"></div>
      <div className="test-card-footer">
        <div className="test-card-footer-img">
          <img src={img} alt="test-img" loading="lazy" />
        </div>
        <div className="test-card-footer-info">
          <h3>{name}</h3>
          <p>{address}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
