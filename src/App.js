import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";
import "./App.css";
import Welcome from "./Components/Welcom/Welcome";
import SignIn from "./Pages/AdminAuthentication/SignIn";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import DashboardAdmin from "./Pages/DashboardAdmin/DashboardAdmin";
import HomeDashBoard from "./Pages/DashboardAdmin/HomeDashBooard";
import Departments from "./Pages/DashboardAdmin/Departments";
import Shifts from "./Pages/DashboardAdmin/Shifts";
import Settings from "./Pages/DashboardAdmin/Settings";
import Department from "./Pages/DashboardAdmin/Department";
import TaskDetails from "./Pages/DashboardAdmin/TaskDetails";
import EmployeeLogin from "./Pages/EmployeeAuthentication/EmployeeLogin";
import EmployeeSignUp from "./Pages/EmployeeAuthentication/EmployeeSignUp";
import AccountConfirmation from "./Pages/EmployeeAuthentication/AccountConfirmation";
import EmployeeRoleAssignment from "./Pages/EmployeeAuthentication/EmployeeRoleAssignment";
import DashboardEmployee from "./Pages/DashboardEmployee/DashboardEmployee";
import HomeDashboard from "./Pages/DashboardEmployee/HomeDashboard";
import Profile from "./Pages/DashboardEmployee/Profile";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="admin-signin" element={<SignIn />} />
            <Route path="forget-password" element={<ForgetPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            {/*  */}
            <Route path="admin-dashboard" element={<DashboardAdmin />}>
              <Route path="home-dashboard" element={<HomeDashBoard />} />
              <Route path="departments" element={<Departments />} />
              <Route path="shifts" element={<Shifts />} />
              <Route path="settings" element={<Settings />} />
              <Route path="task-details/:id" element={<TaskDetails />} />
              <Route path="department/:id" element={<Department />} />
              {/*  */}
            </Route>
            <Route path="login-employee" element={<EmployeeLogin />} />
            <Route path="employee-signup" element={<EmployeeSignUp />} />
            <Route
              path="account-confirmation"
              element={<AccountConfirmation />}
            />
            <Route path="Employee-Role" element={<EmployeeRoleAssignment />} />
            <Route path="employee-dashboard" element={<DashboardEmployee />}>
              <Route path="employee-home" element={<HomeDashboard/>} />
              <Route path="employee-profile" element={<Profile/>} />
              <Route path="task-details/:id" element={<TaskDetails/>} />
            </Route>
          </Routes>
        </div>
        ;
      </BrowserRouter>
    </>
  );
}

export default App;
