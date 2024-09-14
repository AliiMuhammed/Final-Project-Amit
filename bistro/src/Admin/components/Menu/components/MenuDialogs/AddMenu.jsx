import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import "../../../../../Style/edit-dialog-form.css"; 
import http from "../../../../../Helper/http"; 
import { openToast } from "../../../../../Redux/Slices/toastSlice"; 
import { useDispatch } from "react-redux";
import Spinner from "../../../../../Shared/Spinner"; 
import CustomAlert from "../../../../../Shared/CustomAlert"; 
import { validateFormData } from "./addValidationHelper"; 
import { MESSAGES } from "./messages"; 
import { triggerRefresh } from "../../../../../Redux/Slices/refreshSlice";

const AddMenu = ({ open, setOpen }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    photo: null,
    description: "",
    price: "",
    category: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Handle input changes for text fields
  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      photo: e.target.files[0], // Set the uploaded image file
    })); 
  };

  // Close the dialog and reset form
  const handleClose = () => {
    setFormData({
      name: "",
      photo: null,
      description: "",
      price: "",
      category: "",
    });
    setErrors({});
    setErr("");
    setOpen(false);
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

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

      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      // Send the FormData using POST request
      http
        .POST("menu", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          setLoading(false);
          dispatch(
            openToast({
              msg: MESSAGES.addSuccess,
              type: "success",
            })
          );
          dispatch(triggerRefresh());
          handleClose();
        })
        .catch((error) => {
          setLoading(false);
          const errorMsg = error.response?.data?.message || MESSAGES.addFail;
          setErr(errorMsg);

          if (process.env.NODE_ENV === "development") {
            console.error("Error adding item:", error);
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
      <DialogTitle>Add Menu Item</DialogTitle>
      <DialogContent>
        {err && <CustomAlert msg={err} type={"error"} />}
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
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select Category</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Main Dishes">Main Dishes</option>
                <option value="Drinks">Drinks</option>
                <option value="Desserts">Desserts</option>
              </select>
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
          {loading ? <Spinner className="spinner-w" /> : "Add Item"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMenu;
