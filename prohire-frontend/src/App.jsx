import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import AboutUs from "./components/AboutUs.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Testimonials from "./components/Testimonials.jsx";
// import ProfilePage from "./pages/complete-profile.jsx";
import DashboardSidebarHeader from "./pages/dashboard";
import DashboardContent from "./pages/DashboardContent.jsx";
import Forget from "./pages/ForgotPassword.jsx";
import HomePage from "./pages/homepage";
import JobLayout from "./pages/job";
import JobPage from "./pages/JobPage";
import Login from "./pages/login";
import OTPPage from "./pages/OTPPage";
import ProfileEditForm from "./pages/ProfileEditForm.jsx";
import RegistrationForm from "./pages/registrationform";
import SavedJobsLayout from "./pages/SavedLayout.jsx";
import SavedPage from "./pages/SavedPage.jsx";
import SendOTPPage from "./pages/SendOTPPage";
import Settings from "./pages/Settings";
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
        <Route path="/forget" element={<Forget />} />
        {/* <Route path="/saved_jobs" element={<SavedJobsLayout />} /> */}

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
              <DashboardSidebarHeader>
                <DashboardContent></DashboardContent>
              </DashboardSidebarHeader>
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout></DashboardLayout>
            </ProtectedRoute>
          }
        /> */}

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
          path="/jobs_save"
          element={
            <ProtectedRoute>
              <SavedJobsLayout>
                <SavedPage />
              </SavedJobsLayout>
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

        {/* <Route path="/complete-profile" element={<ProfilePage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
