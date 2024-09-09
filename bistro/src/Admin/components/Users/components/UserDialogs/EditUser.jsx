import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import "../../../../../Style/edit-dialog-form.css";
import http from "../../../../../Helper/http";
import { triggerRefresh } from "../../../../../Redux/Slices/refreshSlice";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../../Redux/Slices/toastSlice";
import Spinner from "../../../../../Shared/Spinner";
import CustomAlert from "../../../../../Shared/CustomAlert";
import { validateFormData } from "./validationHelpers";
import { MESSAGES } from "./messages";

const EditUser = ({ open, setOpen, user }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [noChangesError, setNoChangesError] = useState(""); // New state for no changes error

  // Set form data when user prop changes
  useEffect(() => {
    if (user) {
      resetForm();
    }
  }, [user]);

  // Reset form data
  const resetForm = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setErrors({});
    setErr("");
    setNoChangesError(""); // Reset the no-changes error
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
    setNoChangesError(""); // Clear the no-changes error when form is edited
  };

  // Compare formData with user data to check for changes
  const hasFormChanged = () => {
    return (
      formData.firstName !== user?.firstName ||
      formData.lastName !== user?.lastName ||
      formData.email !== user?.email ||
      formData.phone !== user?.phone
    );
  };

  // Close the dialog and reset form
  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if form data has changed
    if (!hasFormChanged()) {
      setLoading(false);
      setNoChangesError("You must change the user data before updating."); // Set the error message
      return;
    }

    const newErrors = validateFormData(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      http
        .PATCH(`users/${user._id}`, formData)
        .then(() => {
          setLoading(false);
          dispatch(triggerRefresh());
          dispatch(
            openToast({
              msg: MESSAGES.updateSuccess,
              type: "success",
            })
          );
          handleClose();
        })
        .catch((error) => {
          setLoading(false);
          const errorMsg = error.response?.data?.message || MESSAGES.updateFail;
          setErr(errorMsg);

          if (process.env.NODE_ENV === "development") {
            console.error("Error updating user:", error);
          }
        });
    } else {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="edit-dialog-form"
      scroll="paper"
      fullWidth
    >
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        {err && <CustomAlert msg={err} type={"error"} />}
        {/* New error message for no changes */}
        {noChangesError && (
          <CustomAlert msg={noChangesError} type={"warning"} />
        )}
        <div className="edit-form">
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="off"
                disabled={loading}
              />
              {errors.firstName && (
                <span className="error-msg">{errors.firstName}</span>
              )}
            </div>
            <div className="input-field">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="off"
                disabled={loading}
              />
              {errors.lastName && (
                <span className="error-msg">{errors.lastName}</span>
              )}
            </div>
            <div className="input-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                disabled={loading}
              />
              {errors.email && (
                <span className="error-msg">{errors.email}</span>
              )}
            </div>
            <div className="input-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="off"
                disabled={loading}
              />
              {errors.phone && (
                <span className="error-msg">{errors.phone}</span>
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

export default EditUser;
