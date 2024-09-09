import React, { useState,Suspense } from "react";
import "./style/admin.css";
import Dashboard from "./components/Dashboard/Dashboard";
import AdminNav from "./components/AdminNav/AdminNav";
import AdminFooter from "./components/AdminFooter/AdminFooter";
import { Outlet } from "react-router";
import MyToast from "../Shared/MyToast";
import Backdrop from "../Shared/Backdrop";
const Admin = () => {
  const [isSidebarClosed, setIsSidebarClosed] = useState(true);

  const toggleSidebarClass = () => {
    setIsSidebarClosed(!isSidebarClosed);
  };
  return (
    <Suspense fallback={<Backdrop />}>
      <section className="admin-section">
        <div className={`left ${isSidebarClosed ? "sidebar-closed" : ""}`}>
          <Dashboard toggleSidebarClass={toggleSidebarClass} />
        </div>
        <div className="right">
          <AdminNav />
          <Outlet />
          <AdminFooter />
        </div>
      </section>
      <MyToast />
    </Suspense>
  );
};

export default Admin;
