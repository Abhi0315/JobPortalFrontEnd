import "../EmployerPortalStyles/EmployerSidebar.css";
import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
// import './EmployerSidebar.css';

const EmployerSidebar = ({ sidebarData }) => {
  const [activeItem, setActiveItem] = useState("");

  if (!sidebarData || !Array.isArray(sidebarData)) return null;

  const renderIcon = (iconName) => {
    const IconComponent = FaIcons[iconName];
    if (!IconComponent) {
      console.warn(`Icon ${iconName} not found in react-icons/fa`);
      return <FaIcons.FaQuestionCircle className="employer-sidebar-icon" />;
    }
    return <IconComponent className="employer-sidebar-icon" />;
  };

  // Sort sidebar items by order
  const sortedItems = [...sidebarData].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  const handleNavigation = (path, title, e) => {
    e.preventDefault();
    setActiveItem(title);
    console.log(`Navigating to employer section: ${title}`);

    // You can use React Router here instead of window.location
    // For now, using window.location for simplicity
    window.location.href = path;
  };

  const isActive = (title) => activeItem === title;

  return (
    <aside className="employer-sidebar">
      <div className="employer-sidebar-header">
        <h3 className="employer-sidebar-title">Employer Menu</h3>
      </div>

      <nav className="employer-sidebar-nav">
        <ul className="employer-sidebar-menu">
          {sortedItems.map((item, index) => (
            <li key={index} className="employer-sidebar-item">
              <a
                href={item.path}
                className={`employer-sidebar-link ${
                  isActive(item.title) ? "employer-sidebar-active" : ""
                }`}
                onClick={(e) => handleNavigation(item.path, item.title, e)}
                title={item.title}
              >
                <span className="employer-sidebar-icon-wrapper">
                  {renderIcon(item.icon)}
                </span>
                <span className="employer-sidebar-item-title">
                  {item.title}
                </span>
                <span className="employer-sidebar-arrow">
                  <FaIcons.FaChevronRight />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="employer-sidebar-footer">
        <div className="employer-sidebar-support">
          <FaIcons.FaHeadset className="employer-support-icon" />
          <span>Employer Support</span>
        </div>
      </div>
    </aside>
  );
};

export default EmployerSidebar;
