import React, { useState } from "react";
import "../../Style/Employee/EmployeeAuthentication/EmployeeLogin.css";
import LegendsLogo from "../../Components/LegendsLogo/LegendsLogo";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // استيراد SweetAlert2

function EmployeeSignUp() {
  const Navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Passwords do not match.",
      });
      return;
    }

    // Create the employee data object
    const employeeData = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      bankAccount: bankAccount,
      adminCode: adminCode,
      password: password, // Consider NOT storing the password in localStorage
    };

    // Check if all fields have values before storing
    if (name && email && phoneNumber && bankAccount && adminCode && password) {
      // Store the employee data object in localStorage
      localStorage.setItem("employeeData", JSON.stringify(employeeData));
      console.log("Employee data stored in localStorage:", employeeData);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Please select department and level.",
      }).then(() => {
        Navigate("/Employee-Role");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please fill in all fields.",
      });
    }
  };

  return (
    <section className="employee-login-section">
      {/* Reusing the same class */}
      <div className="employee-login-container container">
        <div className="employee-login-row">
          <div
            className="employee-login-form-column col-xl-6 col-12"
            style={{ maxHeight: "80dvh" }}
          >
            {/* Reusing the same class */}
            <form className="employee-login-form" onSubmit={handleSubmit}>
              {/* Reusing the same class */}
              <div className="employee-login-title">
                <h3>Employee Sign Up</h3>
              </div>
              <div className="employee-form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="employee-email-input" // Reusing style
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel" // Use tel type for phone numbers
                  className="employee-email-input" // Reusing style
                  id="phoneNumber"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="employee-form-group">
                <label htmlFor="bankAccount">Bank Account</label>
                <input
                  type="text"
                  className="employee-email-input" // Reusing style
                  id="bankAccount"
                  placeholder="Enter your bank account"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  required
                />
              </div>
              <div className="employee-form-group">
                <label htmlFor="adminCode">Admin Code</label>
                <input
                  type="text"
                  className="employee-email-input" // Reusing style
                  id="adminCode"
                  placeholder="Enter Admin Code"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  required
                />
              </div>
              <div className="employee-form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="employee-password-input" // Reusing style
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="employee-form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  className="employee-password-input" // Reusing style
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="employee-login-btn">
                {/* Reusing style */}
                Sign Up
              </button>
              <div className="text-center mt-3">
                <Link to="/login-employee">Already have an account? Login</Link>
              </div>
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

export default EmployeeSignUp;
