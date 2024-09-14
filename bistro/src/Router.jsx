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
import Menu from './Pages/Menu/Menu';
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
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
    ],
    errorElement: <NotFound />,
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      {
        path: "/admin/users",
        element: <Users />,
      },
      {
        path: "/admin/menu",
        element: <AdminMenu />,
      },
    ],
    errorElement: <NotFound />,
  },
]);
