import React, { Suspense } from "react";
import { Outlet } from 'react-router';
import MoveToTop from './Shared/MoveToTop';
import Backdrop from "./Shared/Backdrop";

function App() {
  return (
  <>
        <Suspense fallback={<Backdrop />}>
        <Outlet />
      </Suspense>
  <MoveToTop/>
  </>
  );
}

export default App;
