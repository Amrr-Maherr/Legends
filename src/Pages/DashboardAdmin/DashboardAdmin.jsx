import { Outlet } from "react-router-dom";
import Navbar from "../../Pages/DashboardAdmin/Navbar"; 
import Sidebar from "../../Pages/DashboardAdmin/Sidebar"; 
import "../../Style/Admin/DashboardAdmin/DashboardAdmin.css"

function DashboardAdmin() {
  return (
    <>
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <Navbar /> 
          <div className="content">
            <Outlet/>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardAdmin;
