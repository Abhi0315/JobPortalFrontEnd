import {
  FiMenu,
  FiBell,
  FiSettings,
  FiUser,
  FiLogOut,
  FiHelpCircle,
  FiGrid,
  FiLock,
  FiShield,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "../styles/header.css";
import axios from "axios";
// import NotificationPopup from "./NotificationPopup"; // Import the new component
import NotificationPopup from "../components/NotificationPopup"; // Adjust the import path as necessary

const routeTitles = {
  "/dashboard": "Dashboard",
  "/jobs": "Jobs Management",
  "/saved_jobs": "Saved Jobs",
  "/candidates": "Candidates",
  "/jobs_save": "Saved Jobs",
  "/settings": "Settings",
  "/reports": "Analytics",
};

const iconComponents = {
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiBell,
  FiMenu,
  FiGrid,
  FiLock,
  FiShield,
};

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // State for notification popup
  const [userData, setUserData] = useState({
    name: "",
    fullName: "",
    email: "",
    profilePicture: null,
    initials: "",
  });
  const [profileMenuItems, setProfileMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef(null);
  const currentTitle = routeTitles[pathname] || "Dashboard";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAllData = async () => {
      try {
        setLoading(true);

        const profileResponse = await axios.get(
          "https://prohires.strangled.net/mainapp/get_user_profile",
          { headers: { Authorization: `Token ${token}` } }
        );

        const { data } = profileResponse.data;
        const fullName = `${data.name} ${data.last_name}`;
        const initials = `${data.name[0]}${data.last_name[0]}`.toUpperCase();

        setUserData({
          name: data.name,
          fullName,
          email: data.email,
          profilePicture: data.profile_picture,
          initials,
        });

        // Fetch profile menu items
        const menuResponse = await axios.get(
          "https://prohires.strangled.net/job/profile_button_items",
          { headers: { Authorization: `Token ${token}` } }
        );

        const processedItems = (menuResponse.data.items || []).map((item) => ({
          ...item,
          visible: item.visible !== false,
          order: item.order || 999,
        }));

        setProfileMenuItems(processedItems);
      } catch (error) {
        console.error("Error fetching data:", error);

        setUserData({
          name: "User",
          fullName: "User Name",
          email: "user@example.com",
          profilePicture: null,
          initials: "UN",
        });

        setProfileMenuItems([
          {
            id: 1,
            label: "Profile",
            icon: "FiUser",
            path: "/ProfileEditForm",
            type: "link",
            visible: true,
            order: 1,
          },
          {
            id: 2,
            label: "Settings",
            icon: "FiSettings",
            path: "/settings",
            type: "link",
            visible: true,
            order: 2,
          },
          { id: 3, type: "divider", visible: true, order: 3 },
          {
            id: 4,
            label: "Logout",
            icon: "FiLogOut",
            action: "logout",
            type: "action",
            visible: true,
            order: 4,
          },
        ]);

        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getIconComponent = (iconName) => {
    if (!iconName) return null;
    if (iconName.startsWith("/media")) return null;
    return iconComponents[iconName] || null;
  };

  const handleMenuItemClick = (item) => {
    if (item.type === "link" && item.path) {
      navigate(item.path);
    } else if (item.type === "action" && item.action === "logout") {
      handleLogout();
    }
    setIsProfileOpen(false);
  };

  if (loading) {
    return (
      <header className="app-header">
        <div className="header-left">
          <button
            className="sidebar-toggle mobile-only"
            onClick={toggleSidebar}
          >
            <FiMenu size={20} />
          </button>
          <h1 className="page-title">Loading...</h1>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <button
            className="sidebar-toggle mobile-only"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FiMenu size={20} />
          </button>
          <h1 className="page-title">{currentTitle}</h1>
        </div>

        <div className="header-right">
          <button
            className="icon-btn"
            aria-label="Notifications"
            onClick={() => setShowNotifications(true)}
          >
            <FiBell size={20} />
          </button>

          <button
            className="icon-btn"
            aria-label="Settings"
            onClick={() => navigate("/settings")}
          >
            <FiSettings size={20} />
          </button>

          <div
            className="user-profile"
            ref={profileRef}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="user-avatar">
              {userData.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  alt={userData.fullName}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
              ) : null}
              <span
                style={{ display: userData.profilePicture ? "none" : "block" }}
              >
                {userData.initials}
              </span>
            </div>
            <div className="user-info">
              <span className="user-name">{userData.name}</span>
            </div>

            {isProfileOpen && (
              <div className="profile-dropdown">
                {profileMenuItems
                  .filter((item) => item.visible !== false)
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((item) => {
                    if (item.type === "divider") {
                      return (
                        <div
                          key={`divider-${item.id}`}
                          className="dropdown-divider"
                        ></div>
                      );
                    }

                    const IconComponent = getIconComponent(item.icon);

                    return (
                      <div
                        key={`item-${item.id}`}
                        className="dropdown-item"
                        onClick={() => handleMenuItemClick(item)}
                      >
                        {IconComponent ? (
                          <IconComponent size={16} />
                        ) : item.icon ? (
                          <img
                            src={item.icon}
                            alt=""
                            className="menu-item-icon"
                            style={{ width: "16px", height: "16px" }}
                          />
                        ) : null}
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification Popup */}
      <NotificationPopup
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};

export default Header;
