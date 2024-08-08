import React from "react";
import "../style/info.css";
import infoImg from "../../../Assets/About/info.jpg";
import MainHeader from "./../../../Shared/MainHeader";
const Info = () => {
  return (
    <section className="info-section">
      <div className="container">
        <div className="info-left">
          <div className="restaurant-info">
            <MainHeader
              header={"A little information for our valuable guest"}
            />
            <p className="desc">
              At place, we believe that dining is not just about food, but also
              about the overall experience. Our staff, renowned for their warmth
              and dedication, strives to make every visit an unforgettable
              event.
            </p>
          </div>
          <div className="cards-numbers">
            <div className="card">
              <h1 className="title">3</h1>
              <p>Locations</p>
            </div>
            <div className="card">
              <h1 className="title">1995</h1>
              <p>Founded</p>
            </div>
            <div className="card">
              <h1 className="title">65+</h1>
              <p>Staff Members</p>
            </div>
            <div className="card">
              <h1 className="title">100%</h1>
              <p>Satisfied Customers</p>
            </div>
          </div>
        </div>

        
        <div className="info-right">
          <img src={infoImg} loading="lazy" alt="info" />
        </div>
      </div>
    </section>
  );
};

export default Info;
