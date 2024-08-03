import React from "react";
import "../Style/delivery.css";
import MainHeader from "./../../../Shared/MainHeader";
import { LuClock } from "react-icons/lu";
import { CiDiscount1 } from "react-icons/ci";
import { PiShoppingCartLight } from "react-icons/pi";
import delivery_1 from "../../../Assets/Home/Delivery_1.jpg";
import delivery_2 from "../../../Assets/Home/Delivery_2.jpg";
import delivery_3 from "../../../Assets/Home/Delivery_3.jpg";
const Delivery = () => {
  return (
    <section className="delivery-section">
      <div className="container">
        <div className="left">
          <div className="vertical-img">
            <img src={delivery_1} loading="lazy" alt="delivery-1" />
          </div>
          <div className="two-images-vertical">
            <div className="img-1">
              <img src={delivery_2} alt="delivery-2" loading="lazy" />
            </div>
            <div className="img-2">
              <img src={delivery_3} alt="delivery-3" loading="lazy" />
            </div>
          </div>
        </div>
        <div className="right">
          <MainHeader header={"Fastest Food Delivery in City"} />
          <p>
            Our visual designer lets you quickly and of drag a down your way to
            customapps for both keep desktop.
          </p>
          <div className="features">
            <div className="feature">
              <span className="icon">
                <LuClock />
              </span>
              Delivery within 30 minutes
            </div>
            <div className="feature">
              <span className="icon">
                <CiDiscount1 />
              </span>
              Best Offer & Prices
            </div>
            <div className="feature">
              <span className="icon">
                <PiShoppingCartLight />
              </span>
              Online Services Available
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Delivery;
