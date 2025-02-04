import "../../Style/ForgetPassword/ForgetPassword.css";
import LegendsLogo from "../../Components/LegendsLogo/LegendsLogo";
import { useState } from "react";
import axios from "axios";

function ForgetPassword() {
    const [Email,setEmail] = useState("")
    const [Code,setCode] = useState("")
    const [Password,setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")
    const handelForgetPassword = (event) => {
        event.preventDefault()
        if (!Email || !Code || !Password || !ConfirmPassword) {
            alert("")
        } else {
            const FormData = {
              email: Email,
              code: Code,
              password: Password,
              password_confirmation:ConfirmPassword
            };
            axios
              .post("https://test.ashlhal.com/api/reset-password",FormData)
                .then((response) => {
                  alert(response.data.message)
              })
                .catch((error) => {
                  alert(error.response.data.message)
              });
        }
    }
  return (
    <>
      <section className="forget-password-section">
        <div className="container forget-password-container">
          <div className="row forget-password-row">
            <div className="col-6 forget-password-form-wrapper">
              <div className="forget-password-form">
                <div className="forget-password-title">
                  <h3 className="forget-password-heading">Reset Password</h3>
                </div>
                <form className="reset-password-form">
                  <div className="form-group email-group">
                    <label htmlFor="email" className="email-label">
                      Email
                    </label>
                    <input
                      onChange={(event) => {
                        setEmail(event.target.value);
                      }}
                      type="email"
                      id="email"
                      className="form-control email-input"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group code-group">
                    <label htmlFor="code" className="code-label">
                      Verification Code
                    </label>
                    <input
                      onChange={(event) => {
                        setCode(event.target.value);
                      }}
                      type="text"
                      id="code"
                      className="form-control code-input"
                      placeholder="Enter verification code"
                    />
                  </div>
                  <div className="form-group password-group">
                    <label htmlFor="password" className="password-label">
                      New Password
                    </label>
                    <input
                      onChange={(event) => {
                        setPassword(event.target.value);
                      }}
                      type="password"
                      id="password"
                      className="form-control password-input"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="form-group confirm-password-group">
                    <label
                      htmlFor="confirm-password"
                      className="confirm-password-label"
                    >
                      Confirm Password
                    </label>
                    <input
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                      }}
                      type="password"
                      id="confirm-password"
                      className="form-control confirm-password-input"
                      placeholder="Confirm your password"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn submit-btn"
                    onClick={(event) => {
                      handelForgetPassword(event);
                    }}
                  >
                    Reset Password
                  </button>
                </form>
              </div>
            </div>
            <div className="col-6 forget-password-logo-wrapper">
              <LegendsLogo className="forget-password-logo" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ForgetPassword;
