import React from "react";
import MainPageHeader from "../../Shared/MainPageHeader";
import "./style/booking.css";
const Booking = () => {
  return (
    <>
      <MainPageHeader
        header="Book A Table"
        paragraph={
          "Discover delectable cuisine and unforgettable moments in our welcoming, culinary haven."
        }
      />
      <section className="booking-section">
        <div className="container">
          <form className="booking-form">
            <div className="two-inline-inputs">
              <div className="input-field">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Enter your name" />
              </div>
              <div className="input-field">
                <label htmlFor="phone"> Phone</label>
                <input type="tel" id="phone" placeholder="+20 000 000000" />
              </div>
            </div>

            <div className="two-inline-inputs">
              <div className="input-field">
                <label htmlFor="date">Date</label>
                <input type="date" id="date" placeholder="Date" />
              </div>
              <div className="input-field">
                <label htmlFor="time">Time</label>
                <input type="time" id="time" placeholder="time" />
              </div>
            </div>

            <div className="input-field">
              <label htmlFor="person">Total Persons</label>
              <select name="person" id="person">
                <option value="">Select</option>
                <option value="1">1 Person</option>
                <option value="2">2 Person</option>
                <option value="3">3 Person</option>
                <option value="4">4 Person</option>
                <option value="5">5 Person</option>
                <option value="5">+5 Person</option>
              </select>
            </div>

            <div className="input-field">
              <button className="main-btn" type="submit">
                Book Now
              </button>
            </div>
          </form>
        </div>
        <div className="map-section">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3451.665798566837!2d14.4263948!3d35.8982436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMjInMzUuMCJTIDQwMDAwIiBQaOG6pXQgTmFt!5e0!3m2!1sen!2s!4v1664144671938!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="map"
          ></iframe>
        </div>
      </section>
    </>
  );
};

export default Booking;
