import React, { useState } from "react";
import "./style/login.css";
import MainPageHeader from "../../Shared/MainPageHeader";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  return (
    <section className="login-section">
      <MainPageHeader
        header={"Login"}
        paragraph={
          "Welcome back to Bistro Bliss! Sign in to explore our menu, book your table, and enjoy an exceptional dining experience"
        }
      />
      <div className="container">
        <div className="login-form">
          <form action="">
            <div className="input-field">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter Email" />
            </div>

            <div className="input-field">
              <label htmlFor="password">Password</label>
              <button
                className="show-pass"
                onClick={() => setShowPass(!showPass)}
                type="button"
              >
                {showPass === true ? <FaEye /> : <FaEyeSlash />}
              </button>
              <input
                type={`${showPass === true ? "text" : "password"}`}
                id="password"
                placeholder="Enter Password"
              />
            </div>
            <div className="input-field">
              <button className="main-btn" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
