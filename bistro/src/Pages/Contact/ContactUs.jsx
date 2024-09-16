import React from "react";
import "./style/contactUs.css";
const ContactUs = () => {
  return (
    <section className="contact-us-section">
      <div className="header-form-container">
        <div className="main-page-header">
          <div className="container">
            <h1 className="main-header">Contact Us</h1>
            <p>
              We consider all the drivers of change gives you the components you
              need to change to create a truly happens.
            </p>
          </div>
        </div>
        <div className="contact-form">
          <div className="container">
            <form>
              <div className="name-email-container">
                <div className="input-field">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" placeholder="Enter your name" />
                </div>
                <div className="input-field">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="input-field">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="Write a subject "
                />
              </div>

              <div className="input-field">
                <label htmlFor="message">Message</label>
                <textarea
                  placeholder="Write your message"
                  id="message"
                  rows="5"
                />
              </div>
              <button className="main-btn">send</button>
            </form>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="contact-info-container">
          <div className="contact-info">
            <h3>call us:</h3>
            <p className="phone">+1-234-567-8900</p>
          </div>
          <div className="contact-info">
            <h3>Hours:</h3>
            <p>Mon-Fri: 11am - 8pm</p>
            <p>Sat-Sun: 9am - 10pm</p>
          </div>
          <div className="contact-info">
            <h3>Our Location:</h3>
            <p>123 Bridge Street Nowhere Land, LA 12345 United States</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
