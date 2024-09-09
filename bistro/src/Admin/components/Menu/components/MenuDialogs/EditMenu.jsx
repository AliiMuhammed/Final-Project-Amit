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

const EditMenu = ({ open, setOpen, item }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    photo: null, // For image file upload
    description: "",
    price: "",
    category: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [noChangesError, setNoChangesError] = useState("");

  // Set form data when item prop changes
  useEffect(() => {
    if (item) {
      resetForm();
    }
  }, [item]);

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: item?.name || "",
      photo: null, // Reset to null for new upload
      description: item?.description || "",
      price: item?.price || "",
      category: item?.category || "",
    });
    setErrors({});
    setErr("");
    setNoChangesError("");
  };

  // Handle input changes for text fields
  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
    setNoChangesError("");
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      photo: e.target.files[0], // Set the uploaded image file
    }));
  };

  // Check for form changes
  const hasFormChanged = () => {
    return (
      formData.name !== item?.name ||
      formData.description !== item?.description ||
      formData.price !== item?.price ||
      formData.category !== item?.category ||
      formData.photo !== null // Check if a new image is uploaded
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
      setNoChangesError("You must change the item data before updating.");
      return;
    }

    // Validate form data
    const newErrors = validateFormData(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Create a new FormData object for image and text data
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);

      // Append photo only if a new image has been uploaded
      if (formData.photo && typeof formData.photo !== "string") {
        formDataToSend.append("photo", formData.photo); // Only append if it's a new image file
      }
      for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      // Send the FormData using PATCH request
      http
        .PATCH(`menu/${item._id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        })
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
            console.error("Error updating item:", error);
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
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent>
        {err && <CustomAlert msg={err} type={"error"} />}
        {noChangesError && (
          <CustomAlert msg={noChangesError} type={"warning"} />
        )}
        <div className="edit-form">
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="off"
                disabled={loading}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>
            <div className="input-field">
              <label htmlFor="photo">Photo</label>
              <input
                type="file"
                id="photo"
                name="photo"
                onChange={handleFileChange}
                disabled={loading}
              />
              {errors.photo && (
                <span className="error-msg">{errors.photo}</span>
              )}
            </div>
            <div className="input-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.description && (
                <span className="error-msg">{errors.description}</span>
              )}
            </div>
            <div className="input-field">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.price && (
                <span className="error-msg">{errors.price}</span>
              )}
            </div>
            <div className="input-field">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.category && (
                <span className="error-msg">{errors.category}</span>
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

export default EditMenu;
