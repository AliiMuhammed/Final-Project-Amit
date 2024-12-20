import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import "../../../Style/edit-dialog-form.css";
import http from "../../../Helper/http";
import { triggerRefresh } from "../../../Redux/Slices/refreshSlice";
import { useDispatch } from "react-redux";
import { openToast } from "../../../Redux/Slices/toastSlice";
import Spinner from "../../../Shared/Spinner";
import CustomAlert from "../../../Shared/CustomAlert";
import { MESSAGES } from "./messages";

const UpdatePass = ({ open, setOpen }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  // Close the dialog and reset form
  const handleClose = () => {
    setFormData({
      password: "",
      newPassword: "",
      passwordConfirm: "",
    });
    setErrors({});
    setErr("");
    setOpen(false);
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword !== formData.passwordConfirm) {
      setErrors({ passwordConfirm: "Passwords do not match." });
      setLoading(false);
      return;
    }

    http
      .PATCH("users/updatePassword", formData)
      .then((response) => {
        setLoading(false);
        dispatch(triggerRefresh());
        dispatch(
          openToast({
            msg: MESSAGES.updatePass,
            type: "success",
          })
        );
        handleClose();
      })
      .catch((error) => {
        setLoading(false);
        const errorMsg =
          error.response?.data?.message || MESSAGES.updatePassFail;
        setErr(errorMsg);

        if (process.env.NODE_ENV === "development") {
          console.error("Error updating password:", error);
        }
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="edit-dialog-form"
      scroll="paper"
      fullWidth
    >
      <DialogTitle>Update Password</DialogTitle>
      <DialogContent>
        {err && <CustomAlert msg={err} type={"error"} />}
        <div className="edit-form">
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label htmlFor="password">Current Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="off"
                disabled={loading}
              />
            </div>
            <div className="input-field">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                autoComplete="off"
                disabled={loading}
              />
            </div>
            <div className="input-field">
              <label htmlFor="passwordConfirm">Confirm New Password</label>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                autoComplete="off"
                disabled={loading}
              />
              {errors.passwordConfirm && (
                <span className="error-msg">{errors.passwordConfirm}</span>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
      <DialogActions>
        <button
          className="main-outline-btn edit-dialog-btn"
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="main-btn edit-dialog-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <Spinner className="spinner-w" /> : "Update"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePass;
