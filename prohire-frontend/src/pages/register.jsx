import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    otp: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = (name, value) => {
    let error = "";

    if (name === "first_name" || name === "last_name") {
      if (!/^[A-Za-z]+$/.test(value.trim())) {
        error = "Only letters allowed";
      }
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Invalid email format";
      }
    }

    if (name === "phone_number") {
      if (!/^\d+$/.test(value)) {
        error = "Only numbers allowed";
      } else if (value.length < 10) {
        error = "Must be at least 10 digits";
      }
    }

    if (name === "password") {
      if (value.length < 6) {
        error = "Password must be at least 6 characters";
      }
    }

    if (name === "confirm_password") {
      if (value !== formData.password) {
        error = "Passwords do not match";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const sendOtp = async () => {
    try {
      setIsSubmitting(true);
      await axios.post("https://jobsphereapi.mooo.com/mainapp/send_otp_for_register_email/", {
        email: formData.email,
      });
      setStep(2);
      setApiError("");
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setIsSubmitting(true);
      await axios.post("https://jobsphereapi.mooo.com/mainapp/verify_otp_email_verification/", {
        email: formData.email,
        otp: formData.otp,
      });
      setStep(3);
      setApiError("");
    } catch (err) {
      setApiError(err.response?.data?.error || "OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "profile_picture" && key !== "resume_link") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        "https://jobsphereapi.mooo.com/mainapp/user_registration/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      setApiError(err.response?.data?.error || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <>
      <h2 className="mb-4 text-center">Create Your Account</h2>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="first_name" className="form-label">
            First Name*
          </label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
            required
          />
          {errors.first_name && (
            <div className="invalid-feedback">{errors.first_name}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="last_name" className="form-label">
            Last Name*
          </label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
            required
          />
          {errors.last_name && (
            <div className="invalid-feedback">{errors.last_name}</div>
          )}
        </div>

        <div className="col-12">
          <label htmlFor="email" className="form-label">
            Email*
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            required
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>

        <div className="col-12">
          <label htmlFor="phone_number" className="form-label">
            Phone Number*
          </label>
          <input
            id="phone_number"
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className={`form-control ${errors.phone_number ? "is-invalid" : ""}`}
            required
          />
          {errors.phone_number && (
            <div className="invalid-feedback">{errors.phone_number}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="password" className="form-label">
            Password*
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            required
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="confirm_password" className="form-label">
            Confirm Password*
          </label>
          <input
            id="confirm_password"
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            className={`form-control ${
              errors.confirm_password ? "is-invalid" : ""
            }`}
            required
          />
          {errors.confirm_password && (
            <div className="invalid-feedback">{errors.confirm_password}</div>
          )}
        </div>
      </div>

      {apiError && <div className="alert alert-danger mt-3">{apiError}</div>}

      <button
        type="button"
        onClick={sendOtp}
        disabled={isSubmitting}
        className="btn btn-primary w-100 mt-4 py-2"
      >
        {isSubmitting ? "Sending OTP..." : "Send OTP"}
      </button>
    </>
  );

  const renderStep2 = () => (
    <>
      <h2 className="mb-4 text-center">Verify Your Email</h2>
      <p className="text-center">
        We've sent a verification code to {formData.email}
      </p>

      <div className="mb-3">
        <label htmlFor="otp" className="form-label">
          OTP*
        </label>
        <input
          id="otp"
          type="text"
          name="otp"
          value={formData.otp}
          onChange={handleChange}
          className={`form-control ${errors.otp ? "is-invalid" : ""}`}
          required
        />
        {errors.otp && <div className="invalid-feedback">{errors.otp}</div>}
      </div>

      {apiError && <div className="alert alert-danger mt-3">{apiError}</div>}

      <button
        type="button"
        onClick={verifyOtp}
        disabled={isSubmitting}
        className="btn btn-primary w-100 mt-2 py-2"
      >
        {isSubmitting ? "Verifying..." : "Verify OTP"}
      </button>

      <button
        type="button"
        onClick={() => setStep(1)}
        className="btn btn-link w-100 mt-2"
      >
        Back
      </button>
    </>
  );

  const renderStep3 = () => (
    <>
      <h2 className="mb-4 text-center">Complete Your Profile</h2>

      <div className="row g-3">
        <div className="col-12">
          <label htmlFor="address" className="form-label">
            Address*
          </label>
          <input
            id="address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`form-control ${errors.address ? "is-invalid" : ""}`}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="city" className="form-label">
            City*
          </label>
          <input
            id="city"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`form-control ${errors.city ? "is-invalid" : ""}`}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="state" className="form-label">
            State*
          </label>
          <input
            id="state"
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`form-control ${errors.state ? "is-invalid" : ""}`}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="country" className="form-label">
            Country*
          </label>
          <input
            id="country"
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={`form-control ${errors.country ? "is-invalid" : ""}`}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="pincode" className="form-label">
            Pincode*
          </label>
          <input
            id="pincode"
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
            required
          />
        </div>

        <div className="col-12">
          <label htmlFor="profile_picture" className="form-label">
            Profile Picture
          </label>
          <input
            id="profile_picture"
            type="file"
            name="profile_picture"
            onChange={handleFileChange}
            className="form-control"
            accept="image/*"
          />
        </div>

        <div className="col-12">
          <label htmlFor="resume_link" className="form-label">
            Resume (PDF)
          </label>
          <input
            id="resume_link"
            type="file"
            name="resume_link"
            onChange={handleFileChange}
            className="form-control"
            accept=".pdf,.doc,.docx"
          />
        </div>
      </div>

      {apiError && <div className="alert alert-danger mt-3">{apiError}</div>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="btn btn-primary w-100 mt-4 py-2"
      >
        {isSubmitting ? "Registering..." : "Complete Registration"}
      </button>

      <button
        type="button"
        onClick={() => setStep(2)}
        className="btn btn-link w-100 mt-2"
      >
        Back
      </button>
    </>
  );

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-lg overflow-hidden">
              <div className="card-header bg-primary text-white py-3">
                <h2 className="mb-0 text-center">ProHire</h2>
              </div>

              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                </form>
              </div>

              <div className="card-footer bg-light text-center py-3">
                <p className="mb-0">
                  Already have an account?{" "}
                  <a href="/login" className="text-primary text-decoration-none">
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;