import { useState } from "react";
import LegendsLogo from "../../Components/LegendsLogo/LegendsLogo";
import "../../Style/ResetPassword/ResetPassword.css"
import axios from "axios";
function ResetPassword() {
    const [Email, setEmail] = useState("")
    const handelResetPassword = (event) => {
        event.preventDefault()
        if (!Email) {
            alert("")
        } else {
            const FormData= {
                email:Email
            }
            axios
              .post("https://test.ashlhal.com/api/forgot-password",FormData)
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
      <section className="reset-password-section">
        <div className="container reset-password-container">
          <div className="row reset-password-row">
            <div className="col-6 reset-password-form-wrapper">
              <div className="reset-password-form">
                <h3 className="reset-password-heading">Reset Password</h3>
                <form className="reset-password-form-content">
                  <div className="form-group email-group">
                    <label htmlFor="email" className="email-label">
                      Email
                    </label>
                    <input
                    onChange={(event)=>{setEmail(event.target.value)}}
                      type="email"
                      id="email"
                      className="form-control email-input"
                      placeholder="Enter your email"
                    />
                  </div>
                  <button type="submit" className="btn submit-btn" onClick={(event)=>{handelResetPassword(event)}}>
                    Send Reset Link
                  </button>
                </form>
              </div>
            </div>
            <div className="col-6 reset-password-logo-wrapper">
              <LegendsLogo className="reset-password-logo" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ResetPassword;
