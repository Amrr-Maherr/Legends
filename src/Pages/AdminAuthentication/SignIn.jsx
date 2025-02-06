import { Link, useNavigate } from "react-router-dom";
import LegendsLogo from "../../Components/LegendsLogo/LegendsLogo";
import "../../Style/Admin/AdminAuthentication/SignIn.css";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // استيراد SweetAlert2

function SignIn() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const Navigate = useNavigate();

  const handelSignIn = (event) => {
    event.preventDefault();
    if (!Email || !Password) {
      Swal.fire({
        // عرض تنبيه بالخطأ باستخدام SweetAlert2
        icon: "error",
        title: "Error!",
        text: "Please enter your email and password.",
      });
    } else {
      const FormData = {
        email: Email,
        password: Password,
      };
      axios
        .post("https://test.ashlhal.com/api/login", FormData)
        .then((response) => {
          const token = response.data.token;
          localStorage.setItem("AuthToken", JSON.stringify(token));
          Swal.fire({
            // عرض تنبيه بالنجاح باستخدام SweetAlert2
            icon: "success",
            title: "Success!",
            text: response.data.message || "Login successful!",
          });
          Navigate("/admin-dashboard/home-dashboard");
        })
        .catch((error) => {
          Swal.fire({
            // عرض تنبيه بالخطأ باستخدام SweetAlert2
            icon: "error",
            title: "Error!",
            text: error.response.data.message || "Login failed!",
          });
        });
    }
  };

  return (
    <>
      <section className="signin-section">
        <div className="container signin-container">
          <div className="row signin-row">
            <div className="col-12 col-md-6 signin-form-column">
              <div className="admin-signin-form">
                <div className="admin-signin-title">
                  <h3 className="signin-title">Welcome Back</h3>
                </div>
                <form className="signin-form">
                  <div className="form-group email-group my-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                      Email address
                    </label>
                    <input
                      onChange={(event) => {
                        setEmail(event.target.value);
                      }}
                      placeholder="Enter Your E-mail"
                      type="email"
                      className="form-control email-input"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                    />
                  </div>
                  <div className="form-group password-group my-3">
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label"
                    >
                      Password
                    </label>
                    <input
                      onChange={(event) => {
                        setPassword(event.target.value);
                      }}
                      placeholder="Enter Your Password"
                      type="password"
                      className="form-control password-input"
                      id="exampleInputPassword1"
                    />
                  </div>
                  <div className="form-group d-flex justify-content-between checkbox-group my-3">
                    <div className="forgetPassword-item">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="exampleCheck1"
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor="exampleCheck1"
                      >
                        Remember me
                      </label>
                    </div>
                    <div className="checkbox-item">
                      <Link to="/reset-password">Forget Password ?</Link>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn signin-btn"
                    onClick={(event) => {
                      handelSignIn(event);
                    }}
                  >
                    Sign In
                  </button>
                </form>
              </div>
            </div>
            <div className="col-12 col-md-6 logo-column d-none d-md-block">
              <LegendsLogo />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignIn;
