import LegendsLogo from "../LegendsLogo/LegendsLogo"
import "../../Style/Welcome/Welcom.css"
function Welcome() {
    return (
      <>
        <section>
          <div className="container welcome-container">
            <div className="row welcome-row">
              <div className="col-12">
                <LegendsLogo />
              </div>
              <div className="col-12">
                <div className="welcome-buttons">
                  <button className="login-admin">Log In As Admin</button>
                  <button className="login-employee">log In As Employee</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
}
export default Welcome