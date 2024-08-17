import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";
import About from "./Pages/About/About";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
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
    ],
    errorElement: <NotFound />,
  },
]);
