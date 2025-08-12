import { FiMenu, FiBell, FiSettings, FiSearch } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import "../styles/header.css";

const routeTitles = {
  "/dashboard": "Dashboard",
  "/jobs": "Jobs Management",
  "/candidates": "Candidates",
  "/settings": "Settings",
  "/reports": "Analytics",
};

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const { pathname } = useLocation();
  const currentTitle = routeTitles[pathname] || "Dashboard";

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FiMenu size={20} />
        </button>
        
        <h1 className="page-title">{currentTitle}</h1>
      </div>

      <div className="header-search">
        <div className="search-container">
          <FiSearch className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="search-input"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="header-right">
        <button className="icon-btn" aria-label="Notifications">
          <FiBell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <button className="icon-btn" aria-label="Settings">
          <FiSettings size={20} />
        </button>
        
        <div className="user-profile">
          <div className="user-avatar">
            <span>PH</span>
          </div>
          <div className="user-info">
            <span className="user-name">Paul Harris</span>
            <span className="user-role">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;