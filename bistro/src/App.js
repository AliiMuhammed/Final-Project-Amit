import React, { Suspense } from "react";
import { Outlet } from "react-router";
import MoveToTop from "./Shared/MoveToTop";
import Backdrop from "./Shared/Backdrop";
import NavBar from "./Shared/NavBar";

function App() {
  return (
    <>
      <Suspense fallback={<Backdrop />}>
        <NavBar/>
        <Outlet />
      </Suspense>
      <MoveToTop />
    </>
  );
}

export default App;
