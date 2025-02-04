import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";
import "./App.css";
import Welcome from "./Components/Welcom/Welcome";
import SignIn from "./Pages/AdminAuthentication/SignIn";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="App">
        <Routes>
          <Route path="/" element={<Welcome/>}/>
            <Route path="admin-signin" element={<SignIn />} />
            <Route path="forget-password" element={<ForgetPassword/>}/>
        </Routes>
        </div>;
      </BrowserRouter>
    </>
  );
}

export default App;
