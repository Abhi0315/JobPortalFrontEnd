import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = (name, value) => {
    let error = "";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        error = "Email is required";
      } else if (!emailRegex.test(value)) {
        error = "Invalid email format";
      }
    }

    if (name === "password") {
      if (!value.trim()) {
        error = "Password is required";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError("");

    // Validate all fields before submission
    Object.keys(formData).forEach((key) => validate(key, formData[key]));

    if (Object.values(errors).some((error) => error)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://jobsphereapi.mooo.com/mainapp/user_login/",
        formData
      );

      if (response.data.token) {
        // Store token in localStorage or context
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Redirect to dashboard or home page
        navigate("/dashboard");
      }
    } catch (err) {
      setApiError(
        err.response?.data?.error || "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setApiError("Please enter your email to reset password");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post("https://jobsphereapi.mooo.com/mainapp/send_otp_forgot_password/", {
        email: formData.email,
      });
      alert("OTP sent to your email for password reset");
    } catch (err) {
      setApiError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <h2 className="mb-4 text-center">Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
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

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password*
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      required
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>

                  {apiError && (
                    <div className="alert alert-danger mb-3">{apiError}</div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-100 py-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        ></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="text-center mt-3">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="btn btn-link text-decoration-none"
                    >
                      Forgot password?
                    </button>
                  </div>
                </form>
              </div>

              <div className="card-footer bg-light text-center py-3">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="text-primary text-decoration-none"
                  >
                    Register
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

export default Login;