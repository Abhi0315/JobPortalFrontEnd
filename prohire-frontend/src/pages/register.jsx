import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (name, value) => {
    let error = "";

    if (name === "firstname" || name === "lastname") {
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

    if (name === "phone") {
      if (!/^\d+$/.test(value)) {
        error = "Only numbers allowed";
      } else if (value.length < 10) {
        error = "Must be at least 10 digits";
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

    // Re-validate all fields before submission
    const currentErrors = {};
    Object.keys(formData).forEach((key) => {
      validate(key, formData[key]);
      if (errors[key]) currentErrors[key] = errors[key];
    });

    if (Object.values(currentErrors).some((err) => err)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post("https://reqres.in/api/users", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("✅ Registration successful! ID: " + res.data.id);
      console.log("Response:", res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center bg-light"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-lg overflow-hidden">
              <div className="card-header bg-primary text-white py-4">
                <h2 className="mb-0 text-center fw-bold">
                  ProHire - Create Your Account
                </h2>
                <p className="mb-0 text-center opacity-75">
                  Join us today - it takes just a minute
                </p>
              </div>

              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    {/* First Name */}
                    <div className="col-md-6">
                      <label htmlFor="firstname" className="form-label">
                        First Name
                      </label>
                      <input
                        id="firstname"
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.firstname ? "is-invalid" : ""
                        }`}
                        placeholder="John"
                      />
                      {errors.firstname && (
                        <div className="invalid-feedback">
                          {errors.firstname}
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="col-md-6">
                      <label htmlFor="lastname" className="form-label">
                        Last Name
                      </label>
                      <input
                        id="lastname"
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.lastname ? "is-invalid" : ""
                        }`}
                        placeholder="Doe"
                      />
                      {errors.lastname && (
                        <div className="invalid-feedback">
                          {errors.lastname}
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="col-12">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="col-12">
                      <label htmlFor="phone" className="form-label">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.phone ? "is-invalid" : ""
                        }`}
                        placeholder="1234567890"
                      />
                      {errors.phone && (
                        <div className="invalid-feedback">{errors.phone}</div>
                      )}
                    </div>

                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary w-100 py-3 fw-bold"
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Processing...
                          </>
                        ) : (
                          "Register Now"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="card-footer bg-light text-center py-3">
                <p className="mb-0">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-decoration-none fw-bold text-primary"
                  >
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
