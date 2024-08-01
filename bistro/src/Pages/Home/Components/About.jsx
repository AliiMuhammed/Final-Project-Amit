import React from "react";
import "../Style/about.css";
import MainHeader from "../../../Shared/MainHeader";
import { Link } from "react-router-dom";
import aboutImg from "../../../Assets/Home/about-section.png";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";

const About = () => {
  return (
    <section className="about-section">
      <div className="container">
        <div className="left">
          <div className="about-section-img">
            <img src={aboutImg} loading="lazy" alt="about section" />
          </div>
          <div className="about-info">
            <h1>Come and visit us</h1>
            <p>
              <FaPhoneAlt /> (414) 857 - 0107
            </p>
            <p>
              <MdEmail /> happytummy@restaurant.com
            </p>
            <p>
              <FaLocationDot /> 837 W. Marshall Lane Marshalltown, IA 50158, Los
              Angeles
            </p>
          </div>
        </div>
        <div className="right">
          <MainHeader header={"We provide healthy food for your family."} />
          <p>
            Our story began with a vision to create a unique dining experience
            that merges fine dining, exceptional service, and a vibrant
            ambiance. Rooted in city's rich culinary culture, we aim to honor
            our local roots while infusing a global palate.
          </p>
          <p>
            At place, we believe that dining is not just about food, but also
            about the overall experience. Our staff, renowned for their warmth
            and dedication, strives to make every visit an unforgettable event.
          </p>
          <Link to={"/about"} className="main-outline-btn">
            more about us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
