import React, { useEffect, useState } from "react";
import "./style/profile.css";
import { getAuthUser,setAuthUser } from "../../Helper/Storage";
import { FaEdit } from "react-icons/fa";
import http from "./../../Helper/http";
import Spinner from "../../Shared/Spinner";
import CustomAlert from "../../Shared/CustomAlert";
import MainHeader from "../../Shared/MainHeader";
import { useDispatch } from "react-redux";
import { openToast } from "../../Redux/Slices/toastSlice";
const Profile = () => {
  const dispatch = useDispatch();
  const user = getAuthUser();
  const [bookings, setBookings] = useState({
    loading: false,
    data: [],
    errMsg: "",
  });

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
            setAuthUser( response.data.user );
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

  const ReadableDateAndTime = (isoDate) => {
    const dateObj = new Date(isoDate);
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }
    return (
      dateObj.toLocaleDateString() +
      " " +
      dateObj.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
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
              <button className="edit-profile">
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
      <div className="user-bookings">
        <div className="container">
          {bookings.loading && (
            <Spinner className={"spinner-r"} size={"large"} />
          )}
          {bookings.errMsg && (
            <CustomAlert msg={bookings.errMsg} type={"error"} />
          )}
          {bookings.data.length === 0 && !bookings.loading && (
            <CustomAlert msg={"No Bookings found"} type={"info"} />
          )}
          {bookings.data.length > 0 && (
            <div className="table-wrapper">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Created At</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.data.map((booking, index) => (
                    <tr key={booking._id}>
                      <td className="booking-icon">{index + 1}</td>
                      <td>{booking.name}</td>
                      <td>{convertToReadableDate(booking.date)}</td>
                      <td>{booking.time}</td>
                      <td>{ReadableDateAndTime(booking.createdAt)}</td>
                      <td>
                        <span className={`status ${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
