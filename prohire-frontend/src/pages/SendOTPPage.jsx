import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/SendOTPPage.css";

const SendOTPPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          "https://prohires.strangled.net${features.background_image}"
        );
        setImageUrl(response.data.imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
        setImageUrl("https://prohires.strangled.net${contact.image_url}");
      }
    };
    fetchImage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://prohires.strangled.net/mainapp/send_otp_forgot_password/",
        {
          email,
        }
      );

      if (response.data.success) {
        setIsSubmitted(true);
        // Navigate to OTP page after 3 seconds to show success message
        setTimeout(() => {
          navigate("/verify-otp", { state: { email } });
        }, 3000);
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while sending the OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="email-page-container">
      <div className="email-center-container">
        <div className="email-left">
          <div className="email-content">
            <h1>Reset your password</h1>
            <p className="instruction-text">
              {isSubmitted
                ? `OTP sent successfully to ${email}`
                : "Enter your email address to receive a one-time password"}
            </p>

            {isSubmitted ? (
              <div className="success-message">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <p>Redirecting to OTP verification...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="email-input"
                    disabled={isLoading}
                  />
                  {error && <p className="error-message">{error}</p>}
                </div>

                <button
                  type="submit"
                  className="send-otp-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="btn-loader"></span>
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            )}

            <p className="remember-password">
              Remember your password?{" "}
              <a href="/login" className="login-link">
                Log in
              </a>
            </p>
          </div>
        </div>

        <div className="email-right">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Password reset visual"
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

export default SendOTPPage;
