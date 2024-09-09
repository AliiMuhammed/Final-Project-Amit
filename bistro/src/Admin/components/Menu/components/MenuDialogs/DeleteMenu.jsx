import React, { useState } from "react";
import http from "../../../../../Helper/http";
import { triggerRefresh } from "../../../../../Redux/Slices/refreshSlice";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../../Redux/Slices/toastSlice";
import CustomAlert from "../../../../../Shared/CustomAlert";
import Spinner from "../../../../../Shared/Spinner";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import "../../../../../Style/delete-dialog.css";
const DeleteMenu = ({ open, setOpen, item }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleClose = () => {
    setOpen(false);
    setErr("");
  };

  const handleDelete = () => {
    setLoading(true);
    http
      .DELETE(`menu/${item._id}`)
      .then((res) => {
        setLoading(false);
        dispatch(triggerRefresh());
        dispatch(
          openToast({ msg: "Item deleted successfully", type: "success" })
        );
        handleClose();
      })
      .catch((err) => {
        setLoading(false);
        setErr("Failed to delete item");
      });
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      fullWidth={true}
      className="delete-dialog"
    >
      <DialogTitle>Delete Item</DialogTitle>
      <DialogContent>
        {err !== "" && <CustomAlert msg={err} type={"error"} />}
        <p className="delete-dialog-p">
          Are you sure you want to delete this item?
        </p>
      </DialogContent>
      <DialogActions>
        <button
          className="main-outline-btn delete-dialog-btn"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          className="main-btn delete-dialog-btn"
          onClick={handleDelete}
          autoFocus
          disabled={loading}
        >
          {loading ? <Spinner className={"spinner-w"} /> : "Delete"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMenu;
