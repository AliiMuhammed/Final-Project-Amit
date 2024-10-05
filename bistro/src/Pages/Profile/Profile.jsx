import React from "react";
import "./style/profile.css";
import { getAuthUser } from "../../Helper/Storage";
import { FaEdit } from "react-icons/fa";

const Profile = () => {
  const user = getAuthUser()?.data?.user;
  console.log(user);
  return (
    <section className="profile-section">
      <div className="user-info">
        <div className="container">
          <div className="user-img">
            <button className="edit-profile">
              <FaEdit />
            </button>
            <img
              crossOrigin="anonymous"
              src={user?.fileUrl}
              alt="user profile "
            />
          </div>
          <h1 className="user-name">{`${user.firstName} ${user.lastName}`}</h1>
        </div>
      </div>
    </section>
  );
};

export default Profile;
