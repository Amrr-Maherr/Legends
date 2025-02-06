import React, { useState } from "react";
import "../../Style/Employee/EmployeeAuthentication/EmployeeLogin.css"; // Reuse existing styles
import LegendsLogo from "../../Components/LegendsLogo/LegendsLogo";
import Swal from "sweetalert2"; // استيراد SweetAlert2
import { useNavigate } from "react-router-dom";
import axios from "axios"; // استيراد Axios

function AccountConfirmation() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(""); // Changed name to verificationCode

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !verificationCode) {
      Swal.fire({
        // عرض تنبيه بالخطأ باستخدام SweetAlert2
        icon: "error",
        title: "Error!",
        text: "Please fill in all fields.",
      });
      return;
    }

    // API call to confirm the account
    axios
      .post("https://test.ashlhal.com/api/verify-email", {
        email: email, // Keep name as email
        verification_code: verificationCode, // Updated to verification_code
      })
      .then((response) => {
        console.log("Account confirmed successfully:", response.data);
        Swal.fire({
          // عرض تنبيه بالنجاح باستخدام SweetAlert2
          icon: "success",
          title: "Success!",
          text: response.data.message || "Account confirmed successfully!",
        }).then(() => {
          // Optional: Redirect to login page after successful confirmation
          navigate("/"); // Redirect to login page
        });
      })
      .catch((error) => {
        Swal.fire({
          // عرض تنبيه بالخطأ باستخدام SweetAlert2
          icon: "error",
          title: "Error!",
          text:
            error.response?.data?.message ||
            error.message ||
            "An error occurred.",
        });
        console.error("Error verifying account:", error);
      });
  };

  return (
    <section className="employee-login-section">
      {/* Reusing the same class */}
      <div className="employee-login-container container">
        <div className="employee-login-row">
          <div className="employee-login-form-column col-6">
            {/* Reusing the same class */}
            <form className="employee-login-form" onSubmit={handleSubmit}>
              {/* Reusing the same class */}
              <div className="employee-login-title">
                <h3>Confirm Account</h3>
              </div>
              {/* No longer needed because SweetAlert2 is used */}
              <div className="employee-form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  className="employee-email-input" // Reusing style
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="employee-form-group">
                <label htmlFor="verificationCode">Verification Code</label>
                {/* Updated label */}
                <input
                  type="text"
                  className="employee-email-input" // Reusing style
                  id="verificationCode" // Updated id
                  placeholder="Enter your verification code" // Updated placeholder
                  value={verificationCode} // Updated value
                  onChange={(e) => setVerificationCode(e.target.value)} // Updated onChange
                  required
                />
              </div>
              <button type="submit" className="employee-login-btn">
                {/* Reusing style */}
                Confirm Account
              </button>
            </form>
          </div>
          <div className="col-6">
            <LegendsLogo />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AccountConfirmation;
