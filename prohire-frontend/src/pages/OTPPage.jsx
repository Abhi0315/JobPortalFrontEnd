import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/OTPPage.css";
import OTPImage from "../assets/otp-img.jpg";

const OTPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState(OTPImage);

  // Initialize email from location state
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      localStorage.setItem("otpEmail", location.state.email); // Store as backup
    } else {
      // Try to get email from localStorage if not in state
      const storedEmail = localStorage.getItem("otpEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        navigate("/forgot-password");
      }
    }
  }, [location, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    setError(""); // Clear error when user types

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all OTP digits are filled
    if (otp.some((digit) => !digit)) {
      setError("Please enter the complete 6-digit OTP code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://prohires.strangled.net/mainapp/verify_otp_email_verification/",
        {
          email,
          otp: otp.join(""),
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Add any required headers like Authorization if needed
          },
        }
      );

      if (response.data.success) {
        // On successful verification
        localStorage.setItem("otpVerified", "true");
        navigate("/change-password", {
          state: {
            email: email,
            otpVerified: true,
          },
        });
      } else {
        setError(
          response.data.message || "Invalid OTP. Please check and try again."
        );
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      let errorMessage =
        "An error occurred during verification. Please try again.";

      if (error.response) {
        // Handle different HTTP status codes
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || "Invalid OTP format";
        } else if (error.response.status === 401) {
          errorMessage = "OTP expired or invalid";
        } else if (error.response.status === 404) {
          errorMessage = "Email not found";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check your internet connection.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isLoading) return;

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://prohires.strangled.net/mainapp/resend_otp_forgot_password/",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setCountdown(30); // Reset countdown
        setOtp(["", "", "", "", "", ""]); // Clear OTP fields
      } else {
        setError(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("Failed to resend OTP. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-page-container">
      <div className="otp-center-container">
        <div className="otp-left">
          <div className="otp-content">
            <h1>Password reset</h1>
            <p className="email-notice">
              We sent a code to <strong>{email}</strong>
            </p>

            <div className="otp-inputs">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      !e.target.value &&
                      e.target.previousSibling
                    ) {
                      e.target.previousSibling.focus();
                    }
                  }}
                  className="otp-digit"
                  disabled={isLoading}
                />
              ))}
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="timer">
              {countdown > 0 ? `Resend available in ${countdown} seconds` : ""}
            </div>

            <button
              onClick={handleSubmit}
              className="verify-btn"
              disabled={isLoading || otp.some((digit) => !digit)}
            >
              {isLoading ? (
                <>
                  <span className="btn-loader"></span>
                  Verifying...
                </>
              ) : (
                "Continue"
              )}
            </button>

            <p className="resend-text">
              Didn't receive the email?{" "}
              <button
                onClick={handleResend}
                className={`resend-btn ${countdown > 0 ? "disabled" : ""}`}
                disabled={countdown > 0 || isLoading}
              >
                Click to resend
              </button>
            </p>

            <a href="/login" className="back-link">
              Back to log in
            </a>
          </div>
        </div>

        <div className="otp-right">
          <img
            src={imageUrl}
            alt="Authentication visual"
            className="auth-image"
            onError={() => setImageUrl("https://via.placeholder.com/600")}
          />
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
