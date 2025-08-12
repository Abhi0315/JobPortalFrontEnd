import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchSidebarData } from "../api/sidebar";
import { MdLogout, MdChevronLeft, MdChevronRight } from "react-icons/md";
import "../styles/sidebar.css";

const Sidebar = ({
  isOpen,
  toggleSidebar,
  width,
  sidebarRef,
  startResizing,
  handleLogout,
}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const loadSidebarData = async () => {
      try {
        setLoading(true);
        const data = await fetchSidebarData();
        
        const formattedMenus = data.map(item => ({
          ...item,
          id: item.title.toLowerCase().replace(/\s+/g, '-'),
          icon: item.icon.startsWith("http") 
            ? item.icon 
            : `https://prohires.strangled.net${item.icon}`
        }));
        
        setMenuItems(formattedMenus);
      } catch (err) {
        console.error("Failed to load sidebar data:", err);
        setMenuItems([
          {
            id: "dashboard",
            title: "Dashboard",
            url: "/dashboard",
            icon: "https://prohires.strangled.net/media/sidebar_icons/home.png"
          },
          {
            id: "settings",
            title: "Settings",
            url: "/settings",
            icon: "https://prohires.strangled.net/media/sidebar_icons/settings.png"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadSidebarData();
  }, []);

  const handleNavigation = (url) => {
    navigate(url);
    // Close sidebar automatically on mobile
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };

  if (loading) {
    return (
      <aside 
        ref={sidebarRef}
        className={`sidebar-loading ${isOpen ? "open" : "collapsed"}`}
        style={{ width: isOpen ? `${width}px` : "72px" }}
      >
        <div className="loading-spinner"></div>
      </aside>
    );
  }

  return (
    <aside
      ref={sidebarRef}
      className={`sidebar ${isOpen ? "open" : "collapsed"}`}
      style={{ width: isOpen ? `${width}px` : "72px" }}
    >
      <div className="sidebar-header">
        {isOpen ? (
          <>
            <h2 className="app-name">ProHire</h2>
            <button 
              className="sidebar-toggle"
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
            >
              <MdChevronLeft size={24} />
            </button>
          </>
        ) : (
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
          >
            <MdChevronRight size={24} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item ${pathname === item.url ? "active" : ""}`}
                onClick={() => handleNavigation(item.url)}
                aria-label={item.title}
              >
                <div className="nav-icon">
                  <img 
                    src={item.icon} 
                    alt={item.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://prohires.strangled.net/media/sidebar_icons/default.png";
                    }}
                  />
                </div>
                {isOpen && <span className="nav-text">{item.title}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button 
          className="logout-btn"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <MdLogout size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>

      {isOpen && (
        <div 
          className="sidebar-resizer" 
          onMouseDown={startResizing}
          aria-label="Resize sidebar"
        />
      )}
    </aside>
  );
};

export default Sidebar;