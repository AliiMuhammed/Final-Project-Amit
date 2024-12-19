import React, { useState } from "react";
import Spinner from "../../../Shared/Spinner";
import CustomAlert from "../../../Shared/CustomAlert";
import "../style/bookingTable.css";

const BookingTable = ({ bookings }) => {
  const [visibleBookings, setVisibleBookings] = useState(5); // State for visible bookings count

  const loadMoreBookings = () => {
    setVisibleBookings((prevCount) => prevCount + 5); // Increment by 5
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

  const convertToReadableDate = (isoDate) => {
    const dateObj = new Date(isoDate);
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }
    return dateObj.toLocaleDateString("en-GB");
  };

  const isLoadMoreDisabled = visibleBookings >= bookings.data.length;

  return (
    <div className="user-bookings">
      <div className="container">
        {bookings.loading && <Spinner className={"spinner-r"} size={"large"} />}
        {bookings.errMsg && (
          <CustomAlert msg={bookings.errMsg} type={"error"} />
        )}
        {bookings.data.length === 0 && !bookings.loading && (
          <CustomAlert msg={"No Bookings found"} type={"info"} />
        )}
        {bookings.data.length > 0 && (
          <div className="table-and-btn">
            <div className="table-wrapper">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Booked At</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.data
                    .slice(0, visibleBookings)
                    .map((booking, index) => (
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
            <button
              className="load-more-btn"
              onClick={loadMoreBookings}
              disabled={isLoadMoreDisabled}
            >
              {isLoadMoreDisabled ? "No More Bookings" : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingTable;
