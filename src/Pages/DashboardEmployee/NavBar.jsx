import { useEffect, useState } from "react";
import "../../Style/Employee/NavBar/NavBar.css";
import axios from "axios";
import Loader from "../../Components/Loader/Loader"
import { Link } from "react-router-dom";
function NavBar() {
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [Data, setData] = useState(null); // Initialize Data to null
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Sending API request...");
    axios
      .get("https://test.ashlhal.com/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data && response.data.profile) {
          setData(response.data.profile);
          setError(null); // Clear any previous errors
        } else {
          setError("Invalid profile data received.");
          setData(null); // Set Data to null to indicate no valid data
        }
      })
      .catch((error) => {
        console.error("API request failed:", error);
        setError(
          error.response?.data?.message ||
            "Failed to fetch profile data. Please check your connection."
        );
        setData(null); // Set Data to null to indicate no valid data
      });
    console.log("API request sent.");
  }, [token]);

  if (error) {
    return <div className="navbar">Error: {error}</div>; // Display error message
  }

  return (
    <div className="navbar">
      {Data ? ( // Conditional rendering based on Data
        <>
          <div className="navbar-welcome">
            <h3 className="navbar-welcome-text">Welcome {Data.name}</h3>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default NavBar;
