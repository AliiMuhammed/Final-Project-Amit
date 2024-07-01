import React from "react";
import "./style/notFound.css";
import notFoundImg from "../../Assets/NotFound/notFound.png";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="notFound-section">
      <div className="container">
        <div className="notFound-img">
          <img src={notFoundImg} alt="not found" />
        </div>
        <Link to={"/"} className="main-btn">
          Back To Home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
