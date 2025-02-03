import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";
import "./App.css";
import Welcome from "./Components/Welcom/Welcome";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="App">
        <Routes>
          <Route path="/" element={<Welcome/>}/>
        </Routes>
        </div>;
      </BrowserRouter>
    </>
  );
}

export default App;
