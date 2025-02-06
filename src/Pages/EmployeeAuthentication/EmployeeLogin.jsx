import React, { useState } from "react";
import LegendsLogo from "../../Components/LegendsLogo/LegendsLogo";
import "../../Style/Employee/EmployeeAuthentication/EmployeeLogin.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // استيراد مكتبة axios
import Swal from "sweetalert2"; // استيراد SweetAlert2

function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // تعريف navigate لاستخدامه للتحويل

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("https://test.ashlhal.com/api/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        // في حال نجاح عملية تسجيل الدخول
        console.log("Login successful:", response.data);

        // تخزين التوكن في localStorage
        const token = response.data.token;
        localStorage.setItem("AuthToken", JSON.stringify(token));

        // عرض تنبيه بالنجاح باستخدام SweetAlert2
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message || "Login successful!",
        }).then(() => {
          // تحويل المستخدم إلى صفحة الـ Dashboard
          navigate("/employee-dashboard/employee-home");
        });
      })
      .catch((error) => {
        // في حالة حدوث خطأ، قم بعرض تنبيه بالخطأ
        console.error(
          "Login failed:",
          error.response ? error.response.data.message : error.message
        );
        Swal.fire({
          icon: "error",
          title: "Error!",
          text:
            error.response?.data?.message ||
            "Login failed. Please check your credentials.",
        });
      });
  };

  return (
    <>
      <section className="employee-login-section">
        <div className="employee-login-container container">
          <div className="employee-login-row">
            {/* Form Column */}
            <div className="employee-login-form-column col-xl-6 col-12">
              <form className="employee-login-form" onSubmit={handleSubmit}>
                <div className="employee-login-title">
                  <h3>Employee Login</h3>
                </div>

                <div className="employee-form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    className="employee-email-input"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="employee-form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="employee-password-input"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Row with checkbox on the left and link on the right */}
                <div className="employee-checkbox-group">
                  <div className="form-check">
                    <input type="checkbox" id="rememberMe" />
                    <label htmlFor="rememberMe">Remember Me</label>
                  </div>
                  <Link to="/reset-password">Forgot Password?</Link>
                </div>

                <button type="submit" className="employee-login-btn">
                  Login
                </button>

                <div className="text-center mt-3">
                  <Link to="/employee-signup">
                    Don't have an account? Sign Up
                  </Link>
                </div>
              </form>
            </div>

            {/* Logo Column */}
            <div className="employee-logo-column col-xl-6 col-12 d-none d-md-block">
              <LegendsLogo />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default EmployeeLogin;
