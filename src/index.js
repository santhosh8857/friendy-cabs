import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";
import Login from "./components/main/Login";
import About from "./components/main/About";
import Contact from "./components/main/Contact";
import CustomerRegistration from "./components/main/CustomerRegistration";
import DriverRegistration from "./components/main/DriverRegistration";
import Dashboard from "./components/main/Dashboard";

const routing = (
  <Router>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/about" element={<About />} />
      <Route exact path="/contact" element={<Contact />} />
      <Route exact path="/dashboard/:id" element={<Dashboard />} />

      <Route exact path="/customer" element={<CustomerRegistration />} />
      <Route exact path="/driver" element={<DriverRegistration />} />
    </Routes>
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<React.StrictMode>{routing}</React.StrictMode>);
