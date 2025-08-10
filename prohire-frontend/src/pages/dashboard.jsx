import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/Mainheader";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [userData, setUserData] = useState(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from storage
      if (!token) {
        navigate('/login'); // Redirect if no token
        return;
      }

      const response = await fetch("https://prohires.strangled.net/mainapp/get_user_profile", {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) { 
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const data = await response.json();
      if (data.status === "success") {
        setUserData(data.data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  
  fetchUserProfile();
}, [navigate]);

  const startResizing = () => {
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e) => {
    if (isResizing && sidebarRef.current) {
      const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth > 150 && newWidth < 400) {
        setSidebarWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  const handleLogout = () => {
    // Implement logout logic here
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarWidth={sidebarWidth}
        sidebarRef={sidebarRef}
        startResizing={startResizing}
        handleLogout={handleLogout}
      />
      
      <div className="dashboard-content" style={{ marginLeft: sidebarOpen ? `${sidebarWidth}px` : "60px" }}>
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="dashboard-main">
          {userData ? (
            <div className="profile-section">
              <div className="profile-header">
                <div className="profile-avatar">
                  {userData.profile_picture ? (
                    <img src={userData.profile_picture} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder">
                      {userData.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="profile-info">
                  <h2>{userData.username}</h2>
                  <p>{userData.email}</p>
                  <p>{userData.phone_number}</p>
                </div>
              </div>
              
              <div className="profile-details">
                <div className="detail-card">
                  <h3>Address</h3>
                  {userData.addresses.length > 0 ? (
                    <div className="address">
                      <p>{userData.addresses[0].address}</p>
                      <p>{userData.addresses[0].city}, {userData.addresses[0].state}</p>
                      <p>{userData.addresses[0].country} - {userData.addresses[0].pincode}</p>
                    </div>
                  ) : (
                    <p>No address added</p>
                  )}
                </div>
                
                <div className="detail-card">
                  <h3>Account Information</h3>
                  <p><strong>Member since:</strong> {new Date(userData.created_at).toLocaleDateString()}</p>
                  <p><strong>Last updated:</strong> {new Date(userData.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              {userData.resume_link && (
                <div className="resume-section">
                  <h3>Your Resume</h3>
                  <a href={userData.resume_link} target="_blank" rel="noopener noreferrer" className="resume-link">
                    View Resume
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="loading-container">
              <p>Loading profile data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;