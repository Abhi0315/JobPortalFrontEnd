// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../styles/ForgotPassword.css";
// import ForgotPasswordImage from "../assets/password.jpg";

// const ForgotPassword = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [imageUrl, setImageUrl] = useState(ForgotPasswordImage);
//   const [passwordStrength, setPasswordStrength] = useState({
//     level: "", // 'weak', 'medium', 'strong'
//     message: "",
//     score: 0, // 0-100 scale
//     percentage: 0, // 0-100%
//   });

//   // Get email from location state if coming from OTP page
//   useEffect(() => {
//     if (location.state?.email) {
//       setEmail(location.state.email);
//     } else {
//       navigate("/forget");
//     }
//   }, [location, navigate]);

//   // Validate password strength on change
//   useEffect(() => {
//     if (password.length === 0) {
//       setPasswordStrength({
//         level: "",
//         message: "",
//         score: 0,
//         percentage: 0,
//       });
//       return;
//     }

//     const hasUppercase = /[A-Z]/.test(password);
//     const hasLowercase = /[a-z]/.test(password);
//     const hasNumber = /[0-9]/.test(password);
//     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//     const isLongEnough = password.length >= 8;
//     const isVeryLong = password.length >= 12;

//     // Calculate strength score (0-100)
//     let score = 0;

//     // Length contributes up to 40 points
//     score += Math.min(40, (password.length / 12) * 40);

//     // Character variety contributes up to 60 points
//     if (hasUppercase) score += 10;
//     if (hasLowercase) score += 10;
//     if (hasNumber) score += 20;
//     if (hasSpecialChar) score += 20;

//     // Bonus for very long passwords
//     if (isVeryLong) score += 10;

//     // Cap at 100
//     score = Math.min(100, score);

//     // Calculate percentage for visual indicator
//     const percentage = Math.floor(score);

//     // Determine strength level and message
//     let level, message;
//     if (score < 40) {
//       level = "weak";
//       const charsNeeded = 8 - password.length;
//       message =
//         charsNeeded > 0
//           ? `Add ${charsNeeded} more character${
//               charsNeeded === 1 ? "" : "s"
//             } to meet minimum length`
//           : "Add uppercase, numbers or special characters";
//     } else if (score < 70) {
//       level = "medium";
//       const missing = [];
//       if (!hasUppercase) missing.push("uppercase letter");
//       if (!hasNumber) missing.push("number");
//       if (!hasSpecialChar) missing.push("special character");

//       message =
//         missing.length > 0
//           ? `Good start! Add ${missing.join(", ")} to strengthen it.`
//           : "Try making your password longer";
//     } else {
//       level = "strong";
//       message = "Strong password! Good job.";
//     }

//     setPasswordStrength({
//       level,
//       message,
//       score,
//       percentage,
//     });
//   }, [password]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (password.length < 8) {
//       setError("Password is too weak. Please use at least 8 characters.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await axios.post(
//         "https://prohires.strangled.net/mainapp/update_password/",
//         {
//           email,
//           password,
//           confirm_password: confirmPassword,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setSuccess(true);
//         localStorage.removeItem("otpEmail");
//         localStorage.removeItem("otpVerified");
//         navigate("/login", { replace: true });
//       } else {
//         setError(response.data.message || "Password reset failed");
//       }
//     } catch (error) {
//       console.error("Reset error:", error);
//       setError(
//         error.response?.data?.message || "An error occurred. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getStrengthColor = () => {
//     const { score } = passwordStrength;
//     if (score < 40) return "#ef4444"; // red
//     if (score < 70) return "#f59e0b"; // amber
//     return "#10b981"; // green
//   };

//   return (
//     <div className="forgot-page-container">
//       <div className="forgot-center-container">
//         <div className="forgot-left">
//           <div className="forgot-content">
//             <h1>Reset Password</h1>
//             {success ? (
//               <>
//                 <p className="success-message">
//                   Your password has been reset successfully!
//                 </p>
//                 <button
//                   onClick={() => navigate("/login", { replace: true })}
//                   className="verify-btn"
//                 >
//                   Back to Login
//                 </button>
//               </>
//             ) : (
//               <>
//                 <p className="instruction-text">
//                   Reset password for <strong>{email}</strong>
//                 </p>
//                 <form onSubmit={handleSubmit}>
//                   <div className="input-group">
//                     <label htmlFor="password">New password</label>
//                     <input
//                       type="password"
//                       id="password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       placeholder="Enter new password"
//                       className="password-input"
//                       disabled={isLoading}
//                       required
//                       minLength="8"
//                     />
//                     {password.length > 0 && (
//                       <div className="password-strength-indicator">
//                         <div className="strength-bar-container">
//                           <div
//                             className="strength-bar"
//                             style={{
//                               width: `${passwordStrength.percentage}%`,
//                               backgroundColor: getStrengthColor(),
//                             }}
//                           ></div>
//                         </div>
//                         <div className="strength-message">
//                           <span
//                             className={`strength-label ${passwordStrength.level}`}
//                           >
//                             {passwordStrength.level.charAt(0).toUpperCase() +
//                               passwordStrength.level.slice(1)}
//                           </span>
//                           <p>{passwordStrength.message}</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div className="input-group">
//                     <label htmlFor="confirmPassword">Confirm password</label>
//                     <input
//                       type="password"
//                       id="confirmPassword"
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       placeholder="Confirm new password"
//                       className="password-input"
//                       disabled={isLoading}
//                       required
//                       minLength="8"
//                     />
//                   </div>

//                   {error && <p className="error-message">{error}</p>}

//                   <button
//                     type="submit"
//                     className="verify-btn"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <>
//                         <span className="btn-loader"></span>
//                         Resetting...
//                       </>
//                     ) : (
//                       "Reset Password"
//                     )}
//                   </button>
//                 </form>
//               </>
//             )}

//             <a href="/login" className="back-link">
//               Remember your password? Log in
//             </a>
//           </div>
//         </div>

//         <div className="forgot-right">
//           <img
//             src={imageUrl}
//             alt="Password reset visual"
//             className="auth-image"
//             onError={() => setImageUrl("https://via.placeholder.com/600")}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ForgotPassword.css";
import ForgotPasswordImage from "../assets/password.jpg";
import { FiEye, FiEyeOff } from "react-icons/fi";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    level: "", // 'weak', 'medium', 'strong'
    message: "",
    score: 0, // 0-100 scale
    percentage: 0, // 0-100%
  });

  // Get email from location state if coming from OTP page
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate("/forget");
    }
  }, [location, navigate]);

  // Validate password strength on change
  useEffect(() => {
    if (password.length === 0) {
      setPasswordStrength({
        level: "",
        message: "",
        score: 0,
        percentage: 0,
      });
      return;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    const isVeryLong = password.length >= 12;

    // Calculate strength score (0-100)
    let score = 0;

    // Length contributes up to 40 points
    score += Math.min(40, (password.length / 12) * 40);

    // Character variety contributes up to 60 points
    if (hasUppercase) score += 10;
    if (hasLowercase) score += 10;
    if (hasNumber) score += 20;
    if (hasSpecialChar) score += 20;

    // Bonus for very long passwords
    if (isVeryLong) score += 10;

    // Cap at 100
    score = Math.min(100, score);

    // Calculate percentage for visual indicator
    const percentage = Math.floor(score);

    // Determine strength level and message
    let level, message;
    if (score < 40) {
      level = "weak";
      const charsNeeded = 8 - password.length;
      message =
        charsNeeded > 0
          ? `Add ${charsNeeded} more character${
              charsNeeded === 1 ? "" : "s"
            } to meet minimum length`
          : "Add uppercase, numbers or special characters";
    } else if (score < 70) {
      level = "medium";
      const missing = [];
      if (!hasUppercase) missing.push("uppercase letter");
      if (!hasNumber) missing.push("number");
      if (!hasSpecialChar) missing.push("special character");

      message =
        missing.length > 0
          ? `Good start! Add ${missing.join(", ")} to strengthen it.`
          : "Try making your password longer";
    } else {
      level = "strong";
      message = "Strong password! Good job.";
    }

    setPasswordStrength({
      level,
      message,
      score,
      percentage,
    });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password is too weak. Please use at least 8 characters.");
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
        localStorage.removeItem("otpEmail");
        localStorage.removeItem("otpVerified");
        navigate("/login", { replace: true });
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

  const getStrengthColor = () => {
    const { score } = passwordStrength;
    if (score < 40) return "#ef4444"; // red
    if (score < 70) return "#f59e0b"; // amber
    return "#10b981"; // green
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
                  onClick={() => navigate("/login", { replace: true })}
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
                  <label htmlFor="password">New password</label>
                  <div className="input-group">
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="password-input"
                        disabled={isLoading}
                        required
                        minLength="8"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                    {password.length > 0 && (
                      <div className="password-strength-indicator">
                        <div className="strength-bar-container">
                          <div
                            className="strength-bar"
                            style={{
                              width: `${passwordStrength.percentage}%`,
                              backgroundColor: getStrengthColor(),
                            }}
                          ></div>
                        </div>
                        <div className="strength-message">
                          <span
                            className={`strength-label ${passwordStrength.level}`}
                          >
                            {passwordStrength.level.charAt(0).toUpperCase() +
                              passwordStrength.level.slice(1)}
                          </span>
                          <p>{passwordStrength.message}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <label htmlFor="confirmPassword">Confirm password</label>
                  <div className="input-group">
                    <div style={{ position: "relative" }}>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="password-input"
                        disabled={isLoading}
                        required
                        minLength="8"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={toggleConfirmPasswordVisibility}
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
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
