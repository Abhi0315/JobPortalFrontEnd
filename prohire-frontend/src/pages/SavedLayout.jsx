import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import useSidebarResize from "../hooks/useSidebarResize";

const SavedJobsLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  useSidebarResize(sidebarRef, isResizing, setIsResizing, setSidebarWidth);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const startResizing = () => {
    setIsResizing(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login", { replace: true });
  };

  return (
    <div className="job-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        width={sidebarWidth}
        sidebarRef={sidebarRef}
        startResizing={startResizing}
        handleLogout={handleLogout}
      />

      <div
        className="main-content"
        style={{
          marginLeft: isSidebarOpen ? `${sidebarWidth}px` : "72px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="content-wrapper">{children}</div>
      </div>
    </div>
  );
};

export default SavedJobsLayout;
