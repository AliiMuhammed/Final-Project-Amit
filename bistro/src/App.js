import React, { Suspense } from "react";
import { Outlet } from "react-router";
import MoveToTop from "./Shared/MoveToTop";
import Backdrop from "./Shared/Backdrop";
import NavBar from "./Shared/NavBar";
import Footer from "./Shared/Footer";
import MyToast from "./Shared/MyToast";
import ScrollToTop from "./Shared/ScrollToTop";

function App() {
  return (
    <>
      <Suspense fallback={<Backdrop />}>
        <NavBar />
        <Outlet />
        <Footer />
        <MyToast />
      </Suspense>
      <ScrollToTop />
      <MoveToTop />
    </>
  );
}

export default App;
