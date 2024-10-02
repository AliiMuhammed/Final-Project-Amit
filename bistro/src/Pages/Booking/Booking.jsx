// Booking.js
import React, { useState, useEffect } from "react";
import MainPageHeader from "../../Shared/MainPageHeader";
import { validateBookingForm } from "./components/FormValidation";
import { getAuthUser } from "../../Helper/Storage";
import LoginDialog from "./components/LoginDialog";
import "./style/booking.css";

const Booking = () => {
  const user = getAuthUser();
  const [values, setValues] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    person: "",
  });

  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false); 

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setValues({ ...values, [id]: value });
  };

  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    setValues({ ...values, [id]: value });
  };
  useEffect(() => {
    if (!user) {
      setOpen(true);
    }
  }, [user]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateBookingForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted successfully", values);
    }
  };

  return (
    <>
      <MainPageHeader
        header="Book A Table"
        paragraph="Discover delectable cuisine and unforgettable moments in our welcoming, culinary haven."
      />
      <section className="booking-section">
        <div className="container">
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="two-inline-inputs">
              <div className="input-field">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={values.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                />
                {errors.name && <p className="error-msg">{errors.name}</p>}
              </div>
              <div className="input-field">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  value={values.phone}
                  onChange={handleInputChange}
                  placeholder="+20 000 000000"
                />
                {errors.phone && <p className="error-msg">{errors.phone}</p>}
              </div>
            </div>

            <div className="two-inline-inputs">
              <div className="input-field">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  value={values.date}
                  onChange={handleInputChange}
                  placeholder="Date"
                />
                {errors.date && <p className="error-msg">{errors.date}</p>}
              </div>
              <div className="input-field">
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  value={values.time}
                  onChange={handleInputChange}
                  placeholder="time"
                />
                {errors.time && <p className="error-msg">{errors.time}</p>}
              </div>
            </div>

            <div className="input-field">
              <label htmlFor="person">Total Persons</label>
              <select
                name="person"
                id="person"
                value={values.person}
                onChange={handleSelectChange}
              >
                <option value="">Select</option>
                <option value="1">1 Person</option>
                <option value="2">2 Person</option>
                <option value="3">3 Person</option>
                <option value="4">4 Person</option>
                <option value="5">5 Person</option>
                <option value="6">+5 Person</option>
              </select>
              {errors.person && <p className="error-msg">{errors.person}</p>}
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
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="map"
          ></iframe>
        </div>

        <LoginDialog open={open} onClose={() => setOpen(false)} />
      </section>
    </>
  );
};

export default Booking;
