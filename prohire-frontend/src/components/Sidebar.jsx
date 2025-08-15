import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchSidebarData } from "../api/sidebar";
import { MdLogout, MdChevronRight, MdMenu, MdClose } from "react-icons/md";
import "../styles/sidebar.css";

const Sidebar = ({
  isOpen,
  toggleSidebar,
  width,
  sidebarRef,
  startResizing,
}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [companyLogo, setCompanyLogo] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadSidebarData = async () => {
      try {
        setLoading(true);
        const data = await fetchSidebarData();

        // Handle logo
        setCompanyLogo(
          data.logo.startsWith("http")
            ? data.logo
            : `https://prohires.strangled.net${data.logo}`
        );

        // 🔥 Handle menu list
        const formattedMenus = (data.menus || []).map((item) => ({
          ...item,
          id: item.title.toLowerCase().replace(/\s+/g, "-"),
          icon: item.icon.startsWith("http")
            ? item.icon
            : `https://prohires.strangled.net${item.icon}`,
        }));

        setMenuItems(formattedMenus);
      } catch (err) {
        console.error("Failed to load sidebar data:", err);

        // fallback menu and logo
        setCompanyLogo(
          "https://prohires.strangled.net/media/company/default_logo.png"
        );

        setMenuItems([
          {
            id: "dashboard",
            title: "Dashboard",
            url: "/dashboard",
            icon: "https://prohires.strangled.net/media/sidebar_icons/home.png",
          },
          {
            id: "settings",
            title: "Settings",
            url: "/settings",
            icon: "https://prohires.strangled.net/media/sidebar_icons/settings.png",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadSidebarData();
  }, []);

  const handleNavigation = (url) => {
    navigate(url);
    if (isMobile) toggleSidebar();
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await fetch("https://prohires.strangled.net/mainapp/user_logout/", {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      localStorage.clear();
      sessionStorage.clear();
      navigate("/login", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
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
            <img
              src={companyLogo}
              alt="Company Logo"
              className="sidebar-logo"
            />
            {isMobile && (
              <button
                className="sidebar-toggle"
                onClick={toggleSidebar}
                aria-label="Close sidebar"
              >
                <MdClose size={24} />
              </button>
            )}
          </>
        ) : (
          <>
          </>
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
                      e.target.src =
                        "https://prohires.strangled.net/media/sidebar_icons/default.png";
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

      {isOpen && !isMobile && (
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
