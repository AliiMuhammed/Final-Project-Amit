import React from "react";
import Alert from "@mui/material/Alert";

const CustomAlert = ({ type, msg }) => {
  return <Alert className="main-Alert" severity={type}>{msg}</Alert>;
};

export default CustomAlert;
