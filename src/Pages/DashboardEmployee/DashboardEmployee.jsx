import { Outlet } from "react-router-dom";
import Navbar from "../../Pages/DashboardEmployee/NavBar";
import Sidebar from "../../Pages/DashboardEmployee/SideBar";
import "../../Style/Employee/EmployeeAuthentication/DashboardEmployee.css";

function DashboardEmployee() {
  return (
    <>
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <Navbar />
          <div className="content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardEmployee;
