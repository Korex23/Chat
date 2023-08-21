import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/authentication/SignUp";
import SignIn from "./components/authentication/SignIn";
import ResetPassword from "./components/authentication/ForgotPassword";
import { useState, useEffect } from "react";
import { auth } from "../src/firebase/config";
import PrivateRoute from "./ProtectedRoutes";
import Dashboard from "./components/authentication/Dashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
