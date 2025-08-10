import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchSidebarData } from "../api/sidebar";

const BACKEND_BASE_URL = "https://prohires.strangled.net"; // Change if your backend runs elsewhere

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  sidebarWidth,
  sidebarRef,
  startResizing,
  handleLogout,
}) => {
  const [sidebarMenus, setSidebarMenus] = useState([]);
  const [logo, setLogo] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchSidebarData().then(data => {
      if (data.logo) setLogo(data.logo.startsWith("http") ? data.logo : `${BACKEND_BASE_URL}${data.logo}`);
      setSidebarMenus(data.menus || data);
    });
  }, []);

  return (
    <div
      ref={sidebarRef}
      className={`sidebar ${sidebarOpen ? "open" : "minimized"}`}
      style={{ width: sidebarOpen ? `${sidebarWidth}px` : "60px" }}
    >
      <div className="sidebar-header">
        {sidebarOpen ? (
          <>
            {logo ? (
              <img
                src={logo}
                alt="Logo"
                className="sidebar-logo"
                style={{ height: 40, marginBottom: 10 }}
              />
            ) : (
              <h2>ProHire</h2>
            )}
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(false)}
              aria-label="Minimize sidebar"
            >
              <span>&#9776;</span>
            </button>
          </>
        ) : (
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(true)}
            style={{ margin: "0 auto" }}
            aria-label="Expand sidebar"
          >
            <span>&#9776;</span>
          </button>
        )}
      </div>
      <div className="sidebar-menu">
        {sidebarMenus.map((menu, idx) => (
          <div
            key={idx}
            className={`menu-item${location.pathname === menu.url ? " active" : ""} ${!sidebarOpen ? "icon-only" : ""}`}
            title={!sidebarOpen ? menu.title : ""}
            onClick={() => navigate(menu.url)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={menu.icon.startsWith("http") ? menu.icon : `${BACKEND_BASE_URL}${menu.icon}`}
              alt={menu.title}
              className="menu-icon"
              style={{ width: 24, height: 24 }}
            />
            {sidebarOpen && <span>{menu.title}</span>}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <img
            src={`${BACKEND_BASE_URL}/media/sidebar_icons/logout.png`}
            alt="Logout"
            className="menu-icon"
            style={{ width: 24, height: 24 }}
          />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
      {sidebarOpen && (
        <div className="sidebar-resizer" onMouseDown={startResizing} />
      )}
    </div>
  );
};

export default Sidebar;