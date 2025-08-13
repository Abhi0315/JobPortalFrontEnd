import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import RegistrationForm from "./pages/registrationform";
import Login from "./pages/login";
import ProfileEditForm from "./pages/ProfileEditForm.jsx";
import AboutUs from "./components/AboutUs.jsx";
import Testimonials from "./components/Testimonials.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./pages/Settings";
import JobPage from "./pages/JobPage";
import JobLayout from "./pages/job";
import OTPPage from "./pages/OTPPage";
import SendOTPPage from "./pages/SendOTPPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/registrationform" element={<RegistrationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/testimonial" element={<Testimonials />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/send-otp" element={<SendOTPPage />} />
        {/* <Route path="/jobs" element={<Jobs />} />
        <Route path="/ProfileEditForm" element={<ProfileEditForm />} />
        <Route path="/dashboard" element={<Dashboard />} /> */}

        {/* <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/ProfileEditForm"
          element={
            <ProtectedRoute>
              <ProfileEditForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobLayout>
                <JobPage />
              </JobLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
