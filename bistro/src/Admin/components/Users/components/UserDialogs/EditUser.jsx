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
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
    });
    setErrors({});
    setErr("");
    setOpen(false);
  };

  // Validation logic
  const validate = () => {
    const newErrors = {};

    // Check if fields are empty
    if (!formData.firstName.trim())
      newErrors.firstName = "*First name is required";
    if (!formData.lastName.trim())
      newErrors.lastName = "*Last name is required";
    if (!formData.email.trim()) newErrors.email = "*Email is required";
    if (!formData.phone.trim()) newErrors.phone = "*Phone number is required";

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "*Invalid email format";
    }

    // Validate Egyptian phone number (11 digits starting with 010, 011, 012, or 015)
    const egyptianPhoneRegex = /^(010|011|012|015)\d{8}$/;
    if (formData.phone && !egyptianPhoneRegex.test(formData.phone)) {
      newErrors.phone =
        "*Invalid phone number. Must start with 010, 011, 012, or 015 and be 11 digits long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleUpdate = () => {
    setLoading(true);
    if (validate()) {
      http
        .PATCH("users/" + user._id, formData)
        .then((response) => {
          setLoading(false);
          dispatch(triggerRefresh());
          dispatch(
            openToast({
              msg: "User updated successfully",
              type: "success",
            })
          );
          handleClose();
        })
        .catch((error) => {
          setLoading(false);
          setErr("Failed to update user");
        });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="edit-dialog-form"
      scroll="paper"
      fullWidth={true}
    >
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        {err !== "" && <CustomAlert msg={err} type={"error"} />}
        <div className="edit-form">
          <form>
            <div className="input-field">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="off"
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
        >
          Cancel
        </button>
        <button
          className="main-btn edit-dialog-btn"
          onClick={handleUpdate}
          autoFocus
          disabled={loading}
        >
          {loading ? <Spinner className={"spinner-w"} /> : "Update"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUser;
