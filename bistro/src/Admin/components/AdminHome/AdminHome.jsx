import React, { useEffect, useState } from "react";
import "./style/adminHome.css";
import MainHeader from "./../../../Shared/MainHeader";
import { Link } from "react-router-dom";
import { MdRestaurantMenu } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import http from "../../../Helper/http";
import Spinner from "../../../Shared/Spinner";
import { Gauge } from "@mui/x-charts/Gauge";

const AdminHome = () => {
  const [bookings, setBookings] = useState({
    loading: false,
    data: [],
    errMsg: "",
  });
  const [users, setUsers] = useState({
    loading: false,
    data: [],
    errMsg: "",
  });
  const [menu, setMenu] = useState({
    loading: false,
    data: [],
    errMsg: "",
  });
  useEffect(() => {
    setBookings({ ...bookings, loading: true });
    setUsers({ ...users, loading: true });
    setMenu({ ...menu, loading: true });
    http
      .GET("bookings")
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
    http
      .GET("users")
      .then((response) => {
        setUsers({ ...users, loading: false, data: response.data.data });
      })
      .catch((err) => {
        setUsers({
          ...users,
          loading: false,
          errMsg: err.response?.data?.message,
        });
      });
    http
      .GET("menu")
      .then((response) => {
        setMenu({ ...menu, loading: false, data: response.data.data });
      })
      .catch((err) => {
        setMenu({
          ...menu,
          loading: false,
          errMsg: err.response?.data?.message,
        });
      });
  }, []);

  return (
    <section className="admin-home">
      <div className="container">
        <div className="admin-header">
          <MainHeader header={"Admin Home"} />
          <p>
            You can manage your restaurant's menu, bookings, and other data
            here.
          </p>
        </div>
        <div className="site-cards">
          <div className="card">
            <div className="left-card">
              <h1>Menu</h1>
              <p>Create, edit, and delete your restaurant's menu items.</p>
              <Link to="/admin/menu">Manage Menu</Link>
            </div>
            <div className="right-card">
              <MdRestaurantMenu />
            </div>
          </div>
          <div className="card">
            <div className="left-card">
              <h1>Bookings</h1>
              <p>View and manage your restaurant's bookings.</p>
              <Link to="/admin/booking">Manage Bookings</Link>
            </div>
            <div className="right-card">
              <FaBook />
            </div>
          </div>
          <div className="card">
            <div className="left-card">
              <h1>Users</h1>
              <p>View and manage your restaurant's users.</p>
              <Link to="/admin/users">Manage Users</Link>
            </div>
            <div className="right-card">
              <FaUsers />
            </div>
          </div>
        </div>
        <div className="charts">
          {menu.loading ? (
            <Spinner className={"spinner-r"} size={"large"} />
          ) : (
            <div className="chart">
              <h1>Total Menu Items</h1>
              <Gauge
                value={menu.data.length}
                startAngle={-90}
                endAngle={90}
                innerRadius="80%"
                outerRadius="100%"
                width={100}
                height={100}
                className="gauge-chart"
              />
            </div>
          )}
          {bookings.loading ? (
            <Spinner className={"spinner-r"} size={"large"} />
          ) : (
            <div className="chart">
              <h1>Total Bookings</h1>
              <Gauge
                value={bookings.data.length}
                startAngle={-90}
                endAngle={90}
                innerRadius="80%"
                outerRadius="100%"
                width={100}
                height={100}
                className="gauge-chart"
              />
            </div>
          )}
          {users.loading ? (
            <Spinner className={"spinner-r"} size={"large"} />
          ) : (
            <div className="chart">
              <h1>Total Users</h1>
              <Gauge
                value={users.data.length}
                startAngle={-90}
                endAngle={90}
                innerRadius="80%"
                outerRadius="100%"
                width={100}
                height={100}
                className="gauge-chart"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminHome;
