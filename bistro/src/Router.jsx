import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";
import About from "./Pages/About/About";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Admin from "./Admin/Admin";
import Users from "./Admin/components/Users/Users";
import AdminMenu from "./Admin/components/Menu/AdminMenu";
import Menu from "./Pages/Menu/Menu";
import ContactUs from "./Pages/Contact/ContactUs";
import Booking from "./Pages/Booking/Booking";
import Profile from "./Pages/Profile/Profile";
import AdminHome from "./Admin/components/AdminHome/AdminHome";
import AdminBooking from "./Admin/components/AdminBooking/AdminBooking";
import Guest from "./Middleware/Guest";
import GuestProfile from "./Middleware/GuestProfile";
import AdminMiddleware from "./Middleware/AdminMiddleware";
import { Navigate } from 'react-router-dom';

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        element: <Guest />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
        ],
      },

      {
        path: "/menu",
        element: <Menu />,
      },
      // {
      //   path: "/contact",
      //   element: <ContactUs />,
      // },
      {
        path: "/booking",
        element: <Booking />,
      },
      {
        element: <GuestProfile />,
        children: [
          {
            path: "/profile/:id",
            element: <Profile />,
          },
        ],
      },
    ],
    errorElement: <NotFound />,
  },
  {
    element: <AdminMiddleware />,
    children: [
      {
        path: "/admin",
        element: <Admin />,
        children: [
          {
            path: "", // this matches the /admin route exactly
            element: <Navigate to="/admin/home" replace />,
          },

          {
            path: "/admin/home",
            element: <AdminHome />,
          },
          {
            path: "/admin/users",
            element: <Users />,
          },
          {
            path: "/admin/menu",
            element: <AdminMenu />,
          },
          {
            path: "/admin/booking",
            element: <AdminBooking />,
          },
          {
            element: <GuestProfile />,
            children: [
              {
                path: "/admin/profile/:id",
                element: <Profile />,
              },
            ],
          },
        ],
        errorElement: <NotFound />,
      },
    ],
  },
]);
