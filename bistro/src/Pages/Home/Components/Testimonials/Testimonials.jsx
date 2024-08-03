import React from "react";
import "./style/testimonials.css";
import MainHeader from "./../../../../Shared/MainHeader";
import TestimonialCard from "./components/TestimonialCard";
import test_1 from "../../../../Assets/Home/test_1.jpg";
import test_2 from "../../../../Assets/Home/test_2.jpg";
import test_3 from "../../../../Assets/Home/test_3.jpg";
const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="container">
        <MainHeader header={"What Our Customers Say"} />
        <div className="testimonials-cards">
          <TestimonialCard
            title={"The best restaurant"}
            description={
              "Last night, we dined at place and were simply blown away. From the moment we stepped in, we were enveloped in an inviting atmosphere and greeted with warm smiles."
            }
            name={"Sophire Robson"}
            address={"Los Angeles, CA"}
            img={test_1}
          />
          <TestimonialCard
            title={"Simply delicious"}
            description={
              "Place exceeded my expectations on all fronts. The ambiance was cozy and relaxed, making it a perfect venue for our anniversary dinner. Each dish was prepared and beautifully presented."
            }
            name={"Matt Cannon"}
            address={"San Diego, CA"}
            img={test_2}
          />
          <TestimonialCard
            title={"One of a kind restaurant"}
            description={
              "The culinary experience at place is first to none. The atmosphere is vibrant, the food - nothing short of extraordinary. The food was the highlight of our evening. Highly recommended."
            }
            name={"Andy Smith"}
            address={"San Francisco, CA"}
            img={test_3}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
