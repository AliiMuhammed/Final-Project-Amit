import React, { useState } from "react";
import "./style/dashboard.css";
import logo from "../../../Assets/w-logo.png";
import logoIcon from "../../../Assets/w-icon-logo.png";
import { IoCloseOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { FaUsers, FaBook, FaHome } from "react-icons/fa";
import { MdRestaurantMenu } from "react-icons/md";

const Dashboard = ({ toggleSidebarClass }) => {
  const [sideBar, setSideBar] = useState(true);

  const handleToggle = () => {
    setSideBar(!sideBar);
    toggleSidebarClass(); // Call the function from the parent
  };

  return (
    <div className="dashboard-side-bar">
      <div className="side-bar-top">
        <div className="logo">
          <img src={logo} alt="site logo" loading="lazy" />
        </div>
        <button onClick={handleToggle} className="close-btn">
          {sideBar ? (
            <div className="icon-logo">
              <img src={logoIcon} alt="logo icon" />
            </div>
          ) : (
            <IoCloseOutline />
          )}
        </button>
      </div>
      <div className="side-bar-body">
        <ul className="links">
          <li className="link">
            <NavLink to={"/admin/home"}>
              <div className="icon">
                <FaHome />
              </div>
              <span>Home</span>
            </NavLink>
          </li>
          <li className="link">
            <NavLink to={"/admin/users"}>
              <div className="icon">
                <FaUsers />
              </div>
              <span>Users</span>
            </NavLink>
          </li>
          <li className="link">
            <NavLink to={"/admin/menu"}>
              <div className="icon">
                <MdRestaurantMenu />
              </div>
              <span>Menu</span>
            </NavLink>
          </li>
          <li className="link">
            <NavLink to={"/admin/booking"}>
              <div className="icon">
                <FaBook />
              </div>
              <span>Booking</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
