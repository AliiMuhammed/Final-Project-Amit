import React, { useEffect, useState } from "react";
import "./style/profile.css";
import { getAuthUser, setAuthUser } from "../../Helper/Storage";
import { FaEdit } from "react-icons/fa";
import http from "./../../Helper/http";
import MainHeader from "../../Shared/MainHeader";
import { useDispatch } from "react-redux";
import { openToast } from "../../Redux/Slices/toastSlice";
import EditCurrentUser from "./components/EditCurrentUser";
import BookingTable from "./components/BookingTable";
const Profile = () => {
  const dispatch = useDispatch();
  const user = getAuthUser();
  const [bookings, setBookings] = useState({
    loading: false,
    data: [],
    errMsg: "",
  });
  const [openEditUser, setOpenEditUser] = useState(false);
  const handleEditImage = () => {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "image/*";
    inputElement.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        http
          .PATCH("users/updateMe", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log(response.data.user);
            dispatch(
              openToast({
                type: "success",
                msg: "Image updated successfully!",
              })
            );
            // Update local user object with new image
            setAuthUser(response.data.user);
            window.location.reload(); // Refresh page to reflect the new image
          })
          .catch((err) => {
            dispatch(
              openToast({
                type: "error",
                msg: err.response?.data?.message || "Failed to update image",
              })
            );
          });
      }
    };
    inputElement.click();
  };
  useEffect(() => {
    setBookings({ ...bookings, loading: true });
    http
      .GET(`bookings?user=${user._id}`)
      .then((response) => {
        setBookings({ ...bookings, loading: false, data: response.data.data });
      })
      .catch((err) => {
        setBookings({
          ...bookings,
          loading: false,
          errMsg: err.response?.data?.message,
        });
      });
  }, []);

  const convertToReadableDate = (isoDate) => {
    const dateObj = new Date(isoDate);
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }
    return dateObj.toLocaleDateString("en-GB");
  };

  const handleEditClick = () => {
    setOpenEditUser(true);
  };

  return (
    <section className="profile-section">
      <div className="user-info">
        <div className="container">
          <div className="left">
            <div className="user-img">
              <button className="edit-img" onClick={handleEditImage}>
                <FaEdit />
              </button>
              <img
                crossOrigin="anonymous"
                src={user?.fileUrl}
                alt="user profile"
              />
            </div>
          </div>
          <div className="right">
            <div className="name-and-edit">
              <h1 className="user-name">
                {user.firstName} {user.lastName}
              </h1>
              <button
                onClick={() => handleEditClick(user)}
                className="edit-profile"
              >
                <FaEdit />
              </button>
            </div>
            <p className="user-email">
              <span>Email</span>
              {user.email}
            </p>
            <p className="user-phone">
              <span>Phone</span>
              {user.phone}
            </p>
            <p className="booking-count">
              <span>Bookings</span>
              {bookings.data.length}
              {bookings.data.length > 1 ? " Bookings" : " Booking"}
            </p>
            <p className="member-since">
              <span>Member Since:</span>
              {convertToReadableDate(user?.createdAt)}
            </p>
          </div>
        </div>
      </div>
      <MainHeader header={"My Bookings"} />
      <BookingTable bookings={bookings} />
      <EditCurrentUser
        open={openEditUser}
        setOpen={setOpenEditUser}
        user={user}
      />
    </section>
  );
};

export default Profile;
