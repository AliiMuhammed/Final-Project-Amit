import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style/forgetPass.css";
import Spinner from "../../Shared/Spinner";
import http from "../../Helper/http";
import { useDispatch } from "react-redux";
import { openToast } from "../../Redux/Slices/toastSlice";

const ForgetPass = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(30); // State for timer
  const [isResendDisabled, setIsResendDisabled] = useState(false); // Disable button
  const dispatch = useDispatch();

  const validateForm = () => {
    let formErrors = {};
    let valid = true;

    if (!email) {
      formErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Invalid email address";
      valid = false;
    }

    setErrors(formErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      http
        .POST("users/forgotPassword", { email: email })
        .then((res) => {
          setLoading(false);
          dispatch(
            openToast({
              msg: "Reset link is sent to your email successfully",
              type: "success",
            })
          );
          startTimer(); // Start countdown after sending email
        })
        .catch((err) => {
          setLoading(false);
          dispatch(
            openToast({
              msg: err ? err.response.data.message : "Something went wrong",
              type: "error",
            })
          );
        });
    }
  };

  // Countdown timer function
  const startTimer = () => {
    setIsResendDisabled(true); // Disable resend button
    const countdown = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime === 1) {
          clearInterval(countdown);
          setIsResendDisabled(false); // Enable resend button after countdown
          setTimer(30); // Reset timer
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  return (
    <section className="forgetPass-section">
      <div className="container">
        <div className="forget-form">
          <div className="form-header">
            <h2>Forgot Password</h2>
            <p>Enter your email address to reset your password</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <input
                type="text"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="error-msg">{errors.email}</p>}
            </div>
            <div className="input-field">
              <button
                className="main-btn"
                disabled={loading || isResendDisabled}
                type="submit"
              >
                {loading ? (
                  <Spinner className="spinner-w" />
                ) : isResendDisabled ? (
                  `Resend Email in ${timer} sec`
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>
            <div className="forgetPass-links">
              <Link to={"/login"}>Back to Login</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgetPass;
