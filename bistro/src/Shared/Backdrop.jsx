import React from "react";
import "../Style/backDrop.css";
import icon from "../Assets/logo icon.png";
const Backdrop = () => {
  return (
    <div className="backdrop">
      <div className="icon-container">
        <div className="icon-background"></div>
        <div className="icon">
          <img src={icon} alt="logo icon" />
        </div>
      </div>
    </div>
  );
};

export default Backdrop;
