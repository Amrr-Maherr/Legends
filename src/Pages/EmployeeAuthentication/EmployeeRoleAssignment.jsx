import React, { useState, useEffect } from "react";
import "../../Style/Employee/EmployeeAuthentication/EmployeeLogin.css";
import LegendsLogo from "../../Components/LegendsLogo/LegendsLogo";
import axios from "axios"; // استيراد Axios
import { useNavigate } from "react-router-dom";
import "../../Style/Employee/EmployeeAuthentication/EmployeeRoleAssignment.css";
import Swal from "sweetalert2"; // استيراد SweetAlert2

function EmployeeRoleAssignment() {
  const navigate = useNavigate(); // استخدام navigate بدلاً من Navigate
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    const storedEmployeeData = localStorage.getItem("employeeData");
    if (storedEmployeeData) {
      setEmployeeData(JSON.parse(storedEmployeeData));
    }
  }, []);

  const departments = [
    { name: "Marketing" },
    { name: "Sales" },
    { name: "Design" },
    { name: "Development" },
    { name: "Human Resource" },
    { name: "Accounting and Finance" },
  ];

  const levels = [
    { name: "Junior" },
    { name: "Mid-level" },
    { name: "Senior" },
    { name: "Team lead" },
    { name: "Manager" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!department || !level) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please select both Department and Level.",
      });
      return;
    }

    if (!employeeData) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Employee data not found. Please sign up again.",
      });
      return;
    }

    // إعادة تسمية الحقول لتتوافق مع مسميات الخادم
    const formattedData = {
      name: employeeData.name,
      email: employeeData.email,
      password: employeeData.password,
      password_confirmation: employeeData.password, // Assuming password confirmation is the same as password
      manager_code: employeeData.adminCode,
      department: department,
      level: level,
      bank_account: employeeData.bankAccount,
      phone: employeeData.phoneNumber,
    };

    // جلب التوكن من Local Storage
    const authToken = localStorage.getItem("AuthToken");

    // طباعة البيانات التي سيتم إرسالها إلى الكونسول
    console.log("Data being sent to API:", formattedData);

    // استخدام Axios لإرسال الطلب
    axios
      .post("https://test.ashlhal.com/api/register-employee", formattedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // إضافة التوكن إلى رأس الطلب
        },
      })
      .then((response) => {
        console.log("Full response:", response); // طباعة الاستجابة الكاملة
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message || "Registration completed successfully!",
        });
        navigate("/account-confirmation");
      })
      .then(() => {
        localStorage.removeItem("employeeData");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text:
            error.response?.data?.message ||
            error.message ||
            "An error occurred.",
        });
        console.error("Error completing registration:", error);
      });
  };

  return (
    <section className="employee-login-section">
      <div className="employee-login-container container">
        <div className="employee-login-row">
          <div className="employee-login-form-column col-xl-6 col-12">
            <form
              className="employee-login-form employee-select"
              onSubmit={handleSubmit}
            >
              <div className="employee-login-title">
                <h3>Assign Employee Role</h3>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3">
                <div className="employee-form-group">
                  <label htmlFor="department">Department</label>
                  <select
                    id="department"
                    className="employee-email-input"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="employee-form-group">
                  <label htmlFor="level">Level</label>
                  <select
                    id="level"
                    className="employee-email-input"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    required
                  >
                    <option value="">Select Level</option>
                    {levels.map((lvl, index) => (
                      <option key={index} value={lvl.name}>
                        {lvl.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="employee-login-btn">
                Assign Role
              </button>
            </form>
          </div>
          <div className="col-xl-6 col-12 d-none d-md-block">
            <LegendsLogo />
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmployeeRoleAssignment;
