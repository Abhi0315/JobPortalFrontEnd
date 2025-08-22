// import "../EmployerPortalStyles/EmployerHeader.css";
import "../EmployerPortalStyles/EmployerHeader.css";
import React from "react";
import * as FaIcons from "react-icons/fa";
// import './';

const EmployerHeader = ({ headerData }) => {
  if (!headerData) return null;

  const renderIcon = (iconName) => {
    const IconComponent = FaIcons[iconName];
    if (!IconComponent) {
      console.warn(`Icon ${iconName} not found in react-icons/fa`);
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
      // Handle custom actions like logout, etc.
      if (label === "Logout") {
        localStorage.removeItem("employer_access_token");
        sessionStorage.removeItem("employer_access_token");
        window.location.href = "/employer/login";
      }
    }
  };

  return (
    <header className="employer-header">
      <div className="employer-header-left">
        <img
          src={headerData.logo}
          alt="Employer Logo"
          className="employer-header-logo"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/40x40/2c3e50/ffffff?text=E";
          }}
        />
        <div className="employer-header-info">
          <h1 className="employer-header-title">{headerData.title}</h1>
          {/* <span className="employer-header-subtitle">Employer Portal</span> */}
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
