import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import RegistrationForm from "./pages/registrationform";
import Login from "./pages/login";
import Jobs from "./pages/Jobs";
import ProfileEditForm from "./pages/ProfileEditForm.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/registrationform" element={<RegistrationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/ProfileEditForm" element={<ProfileEditForm />} />
      </Routes>
    </Router>
  );
}

export default App;
