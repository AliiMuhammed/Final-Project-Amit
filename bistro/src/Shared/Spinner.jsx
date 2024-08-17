import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "../Style/spinner.css";
const Spinner = ({ size, className }) => {
  return (
    <div className="spinner-container">
      <CircularProgress
        className={className}
        size={size === "large" ? 60 : 30}
      />
    </div>
  );
};

export default Spinner;
