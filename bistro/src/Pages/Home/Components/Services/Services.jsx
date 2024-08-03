import React from "react";
import "./style/services.css";
import MainHeader from "./../../../../Shared/MainHeader";
import ServicesCard from "./components/ServicesCard";
import service_1 from "../../../../Assets/Home/service_1.png";
import service_2 from "../../../../Assets/Home/service_2.png";
import service_3 from "../../../../Assets/Home/service_3.png";
import service_4 from "../../../../Assets/Home/service_4.png";
const Services = () => {
  return (
    <section className="services-section">
      <div className="container">
        <MainHeader header={"We also offer unique services for your events"} />
        <div className="services-cards">
          <ServicesCard
            serviceImg={service_1}
            title={"Caterings"}
            description={
              "In the new era of technology we look in the future with certainty and pride for our life."
            }
          />
          <ServicesCard
            serviceImg={service_2}
            title={"Birthdays"}
            description={
              "In the new era of technology we look in the future with certainty and pride for our life."
            }
          />
          <ServicesCard
            serviceImg={service_3}
            title={"Weddings"}
            description={
              "In the new era of technology we look in the future with certainty and pride for our life."
            }
          />
          <ServicesCard
            serviceImg={service_4}
            title={"Events "}
            description={
              "In the new era of technology we look in the future with certainty and pride for our life."
            }
          />
        </div>
      </div>
    </section>
  );
};

export default Services;
