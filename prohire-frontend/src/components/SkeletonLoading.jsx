import { motion } from "framer-motion";
import "../styles/SkeletonLoading.css";

const Loading = ({ type = "page", message = "Loading..." }) => {
  if (type === "button") {
    return (
      <div className="loading-button">
        <div className="loading-spinner"></div>
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="loading-container">
      {/* Animated Logo/Brand */}
      <motion.div
        className="loading-logo"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="logo-shape">
          <span>P</span>
        </div>
        <h2>ProHire</h2>
      </motion.div>

      {/* Animated Spinner */}
      <motion.div
        className="spinner-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="spinner">
          <div className="spinner-inner"></div>
        </div>
      </motion.div>

      {/* Loading Text */}
      <motion.div
        className="loading-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <p>{message}</p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        className="progress-container"
        initial={{ width: 0 }}
        animate={{ width: "60%" }}
        transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
      >
        <div className="progress-bar"></div>
      </motion.div>
    </div>
  );
};

export const PageLoader = () => (
  <Loading type="page" message="Loading ProHire..." />
);
export const ButtonLoader = ({ message = "Sending..." }) => (
  <Loading type="button" message={message} />
);

export default Loading;
