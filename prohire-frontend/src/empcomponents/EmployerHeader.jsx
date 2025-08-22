// import "../EmployerPortalStyles/EmployerHeader.css";
import "../EmployerPortalStyles/EmployerHeader.css";
import React from "react";
import * as FaIcons from "react-icons/fa";
import "../EmployerPortalStyles/EmployerHeader.css";

const EmployerHeader = ({ headerData }) => {
  if (!headerData) return null;

  const renderIcon = (iconName) => {
    const IconComponent = FaIcons[iconName];
    if (!IconComponent) {
      return <FaIcons.FaBuilding className="employer-header-icon" />;
    }
    return <IconComponent className="employer-header-icon" />;
  };

  const handleButtonClick = (action, label) => {
    if (action.startsWith("http") || action.startsWith("/")) {
      console.log(`Navigating to: ${action}`);
      window.location.href = action;
    } else {
      console.log(`Employer action: ${label} - ${action}`);
      if (label === "Logout") {
        localStorage.removeItem("employer_access_token");
        sessionStorage.removeItem("employer_access_token");
        window.location.href = "/employer/login";
      }
    }
  };

  // Safe logo handling - prevent continuous errors
  const handleLogoError = (e) => {
    e.target.style.display = "none";
    // Don't try to set a fallback URL that will also fail
  };

  return (
    <header className="employer-header">
      <div className="employer-header-left">
        <div className="employer-logo-container">
          <img
            src={headerData.logo || "/employer-logo.png"}
            alt="Employer Logo"
            className="employer-header-logo"
            onError={handleLogoError}
          />
          {/* Fallback icon if image fails */}
          {headerData.logo && (
            <div className="employer-logo-fallback" style={{ display: "none" }}>
              <FaIcons.FaBuilding />
            </div>
          )}
        </div>
        <div className="employer-header-info">
          <h1 className="employer-header-title">{headerData.title}</h1>
        </div>
      </div>

      <div className="employer-header-right">
        <div className="employer-header-actions">
          {headerData.buttons?.map((button, index) => (
            <button
              key={index}
              className="employer-header-button"
              onClick={() => handleButtonClick(button.action, button.label)}
              title={button.label}
              aria-label={button.label}
            >
              <span className="employer-header-button-icon">
                {renderIcon(button.icon)}
              </span>
              <span className="employer-header-button-label">
                {button.label}
              </span>
            </button>
          ))}
        </div>

        <div className="employer-header-profile">
          <div className="employer-profile-badge">
            <FaIcons.FaUserCircle className="employer-profile-icon" />
            <span className="employer-profile-name">Employer</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EmployerHeader;
