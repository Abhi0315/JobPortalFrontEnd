import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegistrationForm.css";
import axios from "axios";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Registration, 2: OTP, 3: Additional Details
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
    profilePicture: null,
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    resume: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const otpInputs = useRef([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    if (value && !/^[0-9]$/.test(value)) {
      return;
    }

    const otpArray = formData.otp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("").slice(0, 6);

    setFormData((prev) => ({
      ...prev,
      otp: newOtp,
    }));

    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit OTP" });
      return false;
    }

    if (!/^\d{6}$/.test(formData.otp)) {
      setErrors({ otp: "OTP must contain only numbers" });
      return false;
    }

    return true;
  };

  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    setLoading(true);
    setApiMessage("");

    try {
      const response = await axios.post(
        "https://prohires.strangled.net/mainapp/send_otp_for_register_email/",
        {
          email: formData.email,
        }
      );

      if (response.data && response.data.message) {
        setApiMessage(response.data.message);
        setStep(2);
      } else {
        setApiMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setApiMessage(
        error.response?.data?.error ||
          "An error occurred while sending OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    if (!validateOTP()) return;

    setLoading(true);
    setApiMessage("");

    try {
      const response = await axios.post(
        "https://prohires.strangled.net/mainapp/verify_otp_email_verification/",
        {
          email: formData.email,
          otp: parseInt(formData.otp, 10),
        }
      );

      if (response.data && response.data.message) {
        setApiMessage(response.data.message);
        setStep(3);
      } else {
        setApiMessage("OTP verification failed. Please try again.");
      }
    } catch (error) {
      setApiMessage(
        error.response?.data?.error ||
          "An error occurred during OTP verification. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAdditionalDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiMessage("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("otp", formData.otp);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("first_name", formData.firstName);
      formDataToSend.append("last_name", formData.lastName);
      formDataToSend.append("phone_number", formData.phone);
      if (formData.profilePicture) {
        formDataToSend.append("profile_picture", formData.profilePicture);
      }
      formDataToSend.append("address", formData.address);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("pincode", formData.pincode);
      if (formData.resume) {
        formDataToSend.append("resume_link", formData.resume);
      }

      const response = await axios.post(
        "https://prohires.strangled.net/mainapp/user_registration/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.message) {
        setApiMessage(response.data.message);
        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setApiMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      setApiMessage(
        error.response?.data?.error ||
          "An error occurred during registration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-screen">
      {/* Left Section */}
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

      {/* Right Section */}
      <div className="right-section">
        <div className="form-container">
          {/* API Message Display */}
          {apiMessage && (
            <div
              className={`alert ${
                apiMessage.includes("success") || apiMessage.includes("sent")
                  ? "alert-success"
                  : "alert-danger"
              }`}
            >
              {apiMessage}
            </div>
          )}

          {/* Step 1: Registration Form */}
          {step === 1 && (
            <>
              <h3 className="text-center mb-4">Register</h3>
              <form onSubmit={handleSubmitStep1}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className={`form-control ${
                      errors.firstName ? "is-invalid" : ""
                    }`}
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  {errors.firstName && (
                    <div className="invalid-feedback">{errors.firstName}</div>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className={`form-control ${
                      errors.lastName ? "is-invalid" : ""
                    }`}
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  {errors.lastName && (
                    <div className="invalid-feedback">{errors.lastName}</div>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
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
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className={`form-control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
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
                <div className="mb-3">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn w-100"
                  style={{ backgroundColor: "#2c1475", color: "white" }}
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Continue"}
                </button>
              </form>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <>
              <h3 className="text-center mb-4">Verify Your Email</h3>
              <div className="alert alert-info mb-4">
                An OTP has been sent to your email address {formData.email}.
                Please enter it below.
              </div>
              <form onSubmit={handleSubmitOTP}>
                <div className="otp-container mb-4">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className={`otp-input ${errors.otp ? "is-invalid" : ""}`}
                      value={formData.otp[index] || ""}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      ref={(el) => (otpInputs.current[index] = el)}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                {errors.otp && (
                  <div className="invalid-feedback d-block text-center mb-3">
                    {errors.otp}
                  </div>
                )}

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: "#2c1475", color: "white" }}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Step 3: Additional Details */}
          {step === 3 && (
            <>
              <h3 className="text-center mb-4">Complete Your Profile</h3>
              <form onSubmit={handleSubmitAdditionalDetails}>
                <div className="mb-3">
                  <label className="form-label">Profile Picture</label>
                  <input
                    type="file"
                    name="profilePicture"
                    className="form-control"
                    onChange={handleChange}
                    accept="image/*"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className="form-control"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    className="form-control"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    className="form-control"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    className="form-control"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Resume Upload</label>
                  <input
                    type="file"
                    name="resume"
                    className="form-control"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setStep(2)}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: "#2c1475", color: "white" }}
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Complete Registration"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
