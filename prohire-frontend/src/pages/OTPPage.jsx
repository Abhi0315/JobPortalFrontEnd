import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/OTPPage.css";
import OTPImage from "../assets/otp-img.jpg";

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  // const [imageUrl, setImageUrl] = useState("");
  const [countdown, setCountdown] = useState(30);
  // const location = useLocation();
  const [email] = useState(location.state?.email || "");
  const navigate = useNavigate();

  const imageUrl = OTPImage;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          "https://your-django-api.com/api/auth/otp-image/"
        );
        setImageUrl(response.data.imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
        setImageUrl("https://via.placeholder.com/600");
      }
    };
    fetchImage();
  }, []);

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

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://your-django-api.com/api/auth/verify-otp/",
        {
          email,
          otp: otp.join(""),
        }
      );

      if (response.data.success) {
        navigate("/reset-password");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setCountdown(30);
    try {
      await axios.post("https://your-django-api.com/api/auth/resend-otp/", {
        email,
      });
    } catch (error) {
      console.error("Error resending OTP:", error);
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
                />
              ))}
            </div>

            <div className="timer">
              {countdown > 0 ? `${countdown} | ${otp.length}` : ""}
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
                disabled={countdown > 0}
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
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Authentication visual"
              className="auth-image"
              onLoad={() => console.log("Image loaded successfully")}
              onError={() => setImageUrl("https://via.placeholder.com/600")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
