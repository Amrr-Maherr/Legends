import { Link, useNavigate } from "react-router-dom";
import LegendsLogo from "../../Components/LegendsLogo/LegendsLogo";
import "../../Style/Admin/AdminSideBar/Sidebar.css";
import axios from "axios"; // Import axios

function Sidebar() {
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleLogout = async () => {
    const token = JSON.parse(localStorage.getItem("AuthToken"));

    try {
      // Send a POST request to the API endpoint to logout
      const response = await axios.post(
        `https://test.ashlhal.com/api/logout`,
        {}, // Empty body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // If logout was successful, remove the token from local storage
        localStorage.removeItem("AuthToken");
        // Redirect to the login page
        navigate("/");
        console.log("Logout successful");
      } else {
        throw new Error(`Logout failed with status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle the error (e.g., display an error message)
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <LegendsLogo />
      </div>
      <ul className="sidebar-links">
        <li>
          <Link to="/admin-dashboard/home-dashboard" className="sidebar-link">
            <i className="fa fa-tachometer"></i> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin-dashboard/departments" className="sidebar-link">
            <i className="fa fa-building"></i> Departments
          </Link>
        </li>
        <li>
          <Link to="/admin-dashboard/shifts" className="sidebar-link">
            <i className="fa fa-clock-o"></i> Shifts
          </Link>
        </li>
        <li>
          <Link to="/admin-dashboard/all-tasks" className="sidebar-link">
            <i className="fa fa-tasks"></i> Tasks
          </Link>
        </li>
        <li>
          <Link to="/admin-dashboard/settings" className="sidebar-link">
            <i className="fa fa-cogs"></i> System Settings
          </Link>
        </li>
        <li>
          <Link onClick={handleLogout} className="sidebar-link">
            <i className="fa fa-sign-out"></i> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
