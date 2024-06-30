import React from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { routes } from "./Router";
import store from "./Redux/store"; // Import your Redux store
import App from "./App";
import { createRoot } from 'react-dom/client';
import './Style/index.css';
import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById("root"));
root.render(
  // <Provider store={store}>
  // </Provider>
    <RouterProvider router={routes}>
      <App />
    </RouterProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
