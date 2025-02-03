import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";
import "./App.css";
import Welcome from "./Components/Welcom/Welcome";
import SignIn from "./Pages/AdminAuthentication/SignIn";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="App">
        <Routes>
          <Route path="/" element={<Welcome/>}/>
          <Route path="admin-signin" element={<SignIn/>}/>
        </Routes>
        </div>;
      </BrowserRouter>
    </>
  );
}

export default App;
