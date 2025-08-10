import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import RegistrationForm from "./pages/registrationform";
import Login from "./pages/login";
import Jobs from "./pages/Jobs";
import ProfileEditForm from "./pages/ProfileEditForm.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css";
import Dashboard from "./pages/dashboard";

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
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/homepage";
// import RegistrationForm from "./pages/registrationform";
// import Login from "./pages/login";
// import Jobs from "./pages/Jobs";
// import Dashboard from "./pages/dashboard"; // Import your new Dashboard component
// import ProtectedRoute from "./components/ProtectedRoute"; // You'll need to create this
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";
// import "./App.css";



// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/homepage" element={<HomePage />} />
//         <Route path="/registrationform" element={<RegistrationForm />} />
//         <Route path="/login" element={<Login />} />
        
//         {/* Protected routes (require authentication) */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/jobs" element={<Jobs />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;
