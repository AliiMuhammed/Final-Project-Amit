import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import Slide from "@mui/material/Slide";

const LoginDialog = ({ open, onClose }) => {
  const navigate = useNavigate();
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  const handleClose = () => {
    onClose();
    navigate("/login");
  };

  return (
    <Dialog
      TransitionComponent={Transition}
      scroll="paper"
      fullWidth
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Login Required</DialogTitle>
      <DialogContent
      >
        <DialogContentText>
          You must log in to book a table. Please log in to continue.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button className="main-btn" onClick={handleClose}>
          Go to Login
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;
