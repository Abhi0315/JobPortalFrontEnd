import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ForgotPassword.css";
import ForgotPasswordImage from "../assets/forgot-password.jpg";

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState(ForgotPasswordImage);

  // Get email from location state if coming from OTP page
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, redirect back to forgot password
      navigate("/forget");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength (optional)
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://prohires.strangled.net/mainapp/update_password/",
        {
          email,
          password,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        // Clear local storage
        localStorage.removeItem("otpEmail");
        localStorage.removeItem("otpVerified");
        navigate("/login");
      } else {
        setError(response.data.message || "Password reset failed");
      }
    } catch (error) {
      console.error("Reset error:", error);
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-page-container">
      <div className="forgot-center-container">
        <div className="forgot-left">
          <div className="forgot-content">
            <h1>Reset Password</h1>
            {success ? (
              <>
                <p className="success-message">
                  Your password has been reset successfully!
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="verify-btn"
                >
                  Back to Login
                </button>
              </>
            ) : (
              <>
                <p className="instruction-text">
                  Reset password for <strong>{email}</strong>
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <label htmlFor="password">New Password</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="password-input"
                      disabled={isLoading}
                      required
                      minLength="8"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="password-input"
                      disabled={isLoading}
                      required
                      minLength="8"
                    />
                  </div>

                  {error && <p className="error-message">{error}</p>}

                  <button
                    type="submit"
                    className="verify-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="btn-loader"></span>
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>
              </>
            )}

            <a href="/login" className="back-link">
              Remember your password? Log in
            </a>
          </div>
        </div>

        <div className="forgot-right">
          <img
            src={imageUrl}
            alt="Password reset visual"
            className="auth-image"
            onError={() => setImageUrl("https://via.placeholder.com/600")}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
