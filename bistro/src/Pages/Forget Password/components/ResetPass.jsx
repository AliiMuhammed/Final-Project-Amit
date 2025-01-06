import React, { useState } from "react";
import Spinner from "../../../Shared/Spinner";
import http from "../../../Helper/http";
import { useDispatch } from "react-redux";
import { openToast } from "../../../Redux/Slices/toastSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../style/forgetPass.css";
const ResetPass = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const token = useParams("token").token;
  const navigate = useNavigate();
  const validateForm = () => {
    let formErrors = {};
    let valid = true;

    if (!password) {
      formErrors.password = "Password is required";
      valid = false;
    }

    if (password !== passwordConfirm) {
      formErrors.passwordConfirm = "Passwords do not match";
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
        .PATCH(`users/resetPassword/${token}`, {
          password: password,
          passwordConfirm: passwordConfirm,
        })
        .then((res) => {
          console.log(res);
          setLoading(false);
          dispatch(
            openToast({
              msg: "Password reset successfully",
              type: "success",
            })
          );
          navigate("/login");
        })
        .catch((err) => {
          console.log(err);
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

  return (
    <section className="forgetPass-section">
      <div className="container">
        <div className="forget-form">
          <div className="form-header">
            <h2>Reset Password</h2>
            <p>Enter your new password to reset</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <input
                type="password"
                id="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="error-msg">{errors.password}</p>
              )}
            </div>
            <div className="input-field">
              <input
                type="password"
                id="passwordConfirm"
                placeholder="Confirm Password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              {errors.passwordConfirm && (
                <p className="error-msg">{errors.passwordConfirm}</p>
              )}
            </div>
            <div className="input-field">
              <button className="main-btn" disabled={loading} type="submit">
                {loading ? <Spinner className="spinner-w" /> : "Reset Password"}
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

export default ResetPass;
