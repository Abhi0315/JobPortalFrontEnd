import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/RegistrationForm.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiMessage("");

    try {
      const response = await axios.post(
        "https://prohires.strangled.net/mainapp/user_login/",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const token = response?.data?.token;

      if (token) {
        localStorage.setItem("token", token); // Changed from "authToken" to "token"
        setApiMessage("Login successful");
        navigate("/jobs");
      } else {
        setApiMessage("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setApiMessage(
        error.response?.data?.error ||
          "An error occurred during login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "ProHire | Login";
    const handlePopState = () => {
      navigate("/homepage", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  return (
    <div className="split-screen">
      {/* Left Section - Same as Registration */}
      <div className="left-section">
        <div className="left-content">
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-icon">PH</span>
            </div>
            <h1>ProHire</h1>
          </div>

          <p className="tagline">
            Transform your hiring experience with our powerful recruitment
            platform
          </p>

          <div className="features-container">
            <div className="feature-card">
              <div className="feature-icon-container">
                <span className="feature-icon">👥</span>
              </div>
              <div className="feature-text">
                <h4>Top Talent Pool</h4>
                <p>Access thousands of qualified professionals</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <span className="feature-icon">⚡</span>
              </div>
              <div className="feature-text">
                <h4>Fast Hiring</h4>
                <p>Reduce time-to-hire by 60% with our smart tools</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <span className="feature-icon">🔒</span>
              </div>
              <div className="feature-text">
                <h4>Secure Platform</h4>
                <p>Enterprise-grade security for your data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="right-section">
        <div className="form-container">
          {/* API Message Display */}
          {apiMessage && (
            <div
              className={`alert ${
                apiMessage.toLowerCase().includes("success")
                  ? "alert-success"
                  : "alert-danger"
              }`}
            >
              {apiMessage}
            </div>
          )}

          <h3 className="text-center mb-4">Welcome Back</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
            <div className="mb-3 text-end">
              <Link to="/send-otp" className="text-decoration-none">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="btn w-100 mb-3"
              style={{ backgroundColor: "#2c1475", color: "white" }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="text-center">
              <p>
                Don't have an account?{" "}
                <Link to="/registrationform" className="text-decoration-none">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
