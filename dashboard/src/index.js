import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import "./index.css";
import Home from "./components/Home";
import { GeneralContextProvider } from "./components/GeneralContext";

// =========================
// GET TOKEN FROM LOGIN URL
// =========================

const params = new URLSearchParams(
  window.location.search
);

const tokenFromUrl = params.get("token");

if (tokenFromUrl) {
  // Save token in dashboard's localStorage
  localStorage.setItem("token", tokenFromUrl);

  // Remove token from URL
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );
}

// =========================
// PROTECTED ROUTE
// =========================

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href =
      "http://localhost:3000/login";

    return null;
  }

  return children;
};

// =========================
// REACT ROOT
// =========================

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <BrowserRouter>

      <GeneralContextProvider>

        <Routes>

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

        </Routes>

      </GeneralContextProvider>

    </BrowserRouter>
  </React.StrictMode>
);