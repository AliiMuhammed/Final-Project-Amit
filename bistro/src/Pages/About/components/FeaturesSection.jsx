import React from "react";
import "../style/features-section.css";
import icon_1 from "../../../Assets/About/icon-1.png";
import icon_2 from "../../../Assets/About/icon-2.png";
import icon_3 from "../../../Assets/About/icon-3.png";
const FeaturesSection = () => {
  return (
    <section className="features-section">
      <div className="container">
        <div className="features">
          <div className="feature">
            <span className="icon">
              <img src={icon_1} alt="icon" />
            </span>
            <div className="content">
              <h3>Multi Cuisine</h3>
              <p>
                In the new era of technology we look in the future with
                certainty life.
              </p>
            </div>
          </div>
          <div className="feature">
            <span className="icon">
              <img src={icon_2} alt="icon" />
            </span>
            <div className="content">
              <h3>Easy To Order</h3>
              <p>
                In the new era of technology we look in the future with
                certainty life.
              </p>
            </div>
          </div>
          <div className="feature">
            <span className="icon">
              <img src={icon_3} alt="icon" />
            </span>
            <div className="content">
              <h3>Fast Delivery</h3>
              <p>
                In the new era of technology we look in the future with
                certainty life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
