import React, { useState } from "react";
import "./style/register.css";
import { Link } from "react-router-dom";
import Spinner from "../../Shared/Spinner";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    // This regex validates Egyptian phone numbers (starts with 010, 011, 012, or 015)
    const regex = /^(010|011|012|015)\d{8}$/;
    return regex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required";
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = "Invalid Egyptian phone number format";
    }
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.passwordConfirm.trim()) {
      newErrors.passwordConfirm = "Confirm Password is required";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted", formData);
    }
  };

  return (
    <section className="register-section">
      <div className="container">
        <div className="register-form">
          <div className="form-header">
            <h2>Sign Up</h2>
            <p>
              Join Bistro Bliss today! Sign up to discover our menu, reserve
              your table, and enjoy a personalized dining experience.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <div className="input-err">
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="error-msg">{errors.firstName}</p>
                )}
              </div>
              <div className="input-err">
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="error-msg">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className="input-field">
              <div className="input-err">
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="error-msg">{errors.email}</p>}
              </div>
            </div>
            <div className="input-field">
              <div className="input-err">
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <p className="error-msg">{errors.phone}</p>}
              </div>
            </div>
            <div className="input-field">
              <div className="input-err">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="error-msg">{errors.password}</p>
                )}
              </div>
              <div className="input-err">
                <input
                  type="password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  placeholder="Confirm Password"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                />
                {errors.passwordConfirm && (
                  <p className="error-msg">{errors.passwordConfirm}</p>
                )}
              </div>
            </div>
            <div className="form-links">
              Already have an account? <Link to={"/login"}>Login</Link>
            </div>
            <button disabled={loading} className="main-btn" type="submit">
              {loading ? <Spinner className={"spinner-w"} /> : "Sing Up"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
