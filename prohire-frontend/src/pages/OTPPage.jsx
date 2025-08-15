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
      localStorage.setItem("otpEmail", location.state.email);
    } else {
      const storedEmail = localStorage.getItem("otpEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        navigate("/forget");
      }
    }

    // Prevent going back without verification
    const handleBackButton = (e) => {
      if (!localStorage.getItem("otpVerified")) {
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
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
    setError("");

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.some((digit) => !digit)) {
      setError("Please enter the complete 6-digit OTP code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://prohires.strangled.net/mainapp/verify_forgot_password_otp/",
        {
          email,
          otp: otp.join(""),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        localStorage.setItem("otpVerified", "true");
        navigate("/Forget", {
          state: {
            email: email,
            otpVerified: true,
          },
          replace: true,
        });
      } else {
        setError(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isLoading) return;

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://prohires.strangled.net/mainapp/verify_forgot_password_otp/",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setCountdown(30);
        setOtp(["", "", "", "", "", ""]);
      } else {
        setError(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend error:", error);
      setError("Failed to resend OTP. Please try again.");
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
