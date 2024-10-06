import React, { useState, useEffect } from "react";
import BookingTable from "./components/BookingTable";
import { useSelector } from "react-redux";
import Spinner from "../../../Shared/Spinner";
import CustomAlert from "../../../Shared/CustomAlert";
import http from "../../../Helper/http";
const AdminBooking = () => {
  const refreshCount = useSelector((state) => state.refresh);
  const [booking, setBooking] = useState({
    loading: false,
    data: [],
    errMsg: "",
  });

  useEffect(() => {
    setBooking({ ...booking, loading: true });
    http
      .GET("bookings")
      .then((response) => {
        setBooking({ ...booking, loading: false, data: response.data.data });
      })
      .catch((err) => {
        setBooking({
          ...booking,
          loading: false,
          errMsg: err.response?.data?.message,
        });
      });
  }, [refreshCount]);
  return (
    <section className="admin-booking">
      <div className="container">
        {booking.loading && <Spinner className={"spinner-r"} size={"large"} />}
        {booking.errMsg && <CustomAlert msg={booking.errMsg} type={"error"} />}
        {booking.data.length === 0 && !booking.loading && (
          <CustomAlert msg={"No Bookings found"} type={"info"} />
        )}
        {booking.data.length > 0 && (
          <BookingTable
            data={booking.data}
            headers={[
              "Image",
              "Name",
              "Phone",
              "No. of People",
              "Date",
              "Time",
              "Status",
              "Actions",
            ]}
          />
        )}
      </div>
    </section>
  );
};

export default AdminBooking;
