import { useEffect, useState } from "react";
import { FiWifi, FiWifiOff, FiX } from "react-icons/fi";
import "../styles/OfflineBanner.css";

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isVisible, setIsVisible] = useState(!navigator.onLine);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Remove the white background class
      document.body.classList.remove("offline-mode");
      // Delay hiding to show the online message briefly
      setTimeout(() => setIsVisible(false), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsVisible(true);
      // Add white background class to body
      document.body.classList.add("offline-mode");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initialize on component mount
    if (!navigator.onLine) {
      document.body.classList.add("offline-mode");
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      // Clean up class when component unmounts
      document.body.classList.remove("offline-mode");
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Also remove the white background when closing the banner
    if (!isOnline) {
      document.body.classList.remove("offline-mode");
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`offline-banner ${isOnline ? "online" : "offline"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="offline-content">
        <div className="banner-icon">
          {isOnline ? (
            <FiWifi className="icon online-icon" />
          ) : (
            <FiWifiOff className="icon offline-icon" />
          )}
        </div>

        <div className="banner-text">
          <h4>{isOnline ? "Connection Restored! 🎉" : "You're Offline ⚠️"}</h4>
          <p>
            {isOnline
              ? "Your internet connection has been restored. Happy browsing!"
              : "Please check your internet connection to continue browsing jobs."}
          </p>
        </div>

        <button
          className="close-btn"
          onClick={handleClose}
          aria-label="Close banner"
        >
          <FiX size={18} />
        </button>

        {/* Progress bar for online state */}
        {isOnline && (
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineBanner;
