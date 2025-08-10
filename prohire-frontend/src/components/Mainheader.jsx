import { FiMenu } from "react-icons/fi";
import { useLocation } from "react-router-dom";

const routeTitleMap = {
  "/dashboard": "Dashboard",
  "/jobs": "Jobs",

};

const DashboardHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const title = routeTitleMap[location.pathname] || "Dashboard";

  return (
    <div className="dashboard-header">
      <button
        className="mobile-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FiMenu />
      </button>
      <h1>{title}</h1>
      <div className="user-profile">
        <div className="user-avatar">PH</div>
      </div>
    </div>
  );
};

export default DashboardHeader;