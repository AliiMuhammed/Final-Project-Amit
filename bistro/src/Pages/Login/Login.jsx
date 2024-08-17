import React, { useState } from "react";
import "./style/login.css";
import MainPageHeader from "../../Shared/MainPageHeader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import http from "../../Helper/http";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { openToast } from "../../Redux/Slices/toastSlice";
import { setAuthUser } from "./../../Helper/Storage";
import Spinner from "./../../Shared/Spinner";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

    if (!password) {
      formErrors.password = "Password is required";
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
        .POST("users/login", { email: email, password: password })
        .then((res) => {
          setLoading(false);
          dispatch(openToast({ msg: "Login Successful", type: "success" }));
          navigate("/");
          navigate(0);
          setAuthUser(res);
        })
        .catch((err) => {
          setLoading(false);
          dispatch(openToast({ msg: "Something went wrong", type: "error" }));
          console.log(err);
        });
    }
  };

  return (
    <section className="login-section">
      <div className="container">
        <div className="login-form">
          <div className="form-header">
            <h2>Login</h2>
            <p>
              Welcome back to Bistro Bliss! Sign in to explore our menu, book
              your table, and enjoy an exceptional dining experience
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label htmlFor="email">Email</label>
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
              <label htmlFor="password">Password</label>
              <div className="pass-btn">
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errors.password && (
                <p className="error-msg">{errors.password}</p>
              )}
            </div>
            <div className="login-links">
              <Link to={"/forgot-password"}>forget password</Link>
              <div className="regester">
                Don't have an account?
                <Link to={"/register"}>Sign Up</Link>
              </div>
            </div>
            <div className="input-field">
              <button className="main-btn" disabled={loading} type="submit">
                {loading ? <Spinner className="spinner-w" /> : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
