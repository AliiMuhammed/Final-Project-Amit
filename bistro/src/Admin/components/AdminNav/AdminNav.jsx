import React from "react";
import { HiOutlineLogout } from "react-icons/hi";
import "./style/adminNav.css";
import { getAuthUser, removeAuthUser } from "../../../Helper/Storage";
import { Link, useNavigate } from "react-router-dom";
const AdminNav = () => {
  const user = getAuthUser()?.data?.user;
  const navigate = useNavigate();
  const logout = () => {
    removeAuthUser();
    navigate("/");
  };
  return (
    <nav className="admin-nav">
      <div className="container">
        <div className="nav-contnet">
          <h3 className="admin-name">{`${user?.firstName} ${user?.lastName}`}</h3>
          <Link to={"/admin/profile"} className="admin-img">
            <img
              src={user?.fileUrl}
              crossOrigin="anonymous"
              alt="admin"
              loading="lazy"
            />
          </Link>
          <button onClick={logout} className="logout-btn admin-btn">
            <HiOutlineLogout />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
