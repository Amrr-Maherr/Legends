import { useEffect, useState } from "react";
import "../../Style/Employee/NavBar/NavBar.css";
import axios from "axios";

function NavBar() {
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [Data, setData] = useState([]);

  // دالة لتحويل التوقيت إلى تنسيق 12 ساعة
  function convertTo12HourFormat(time) {
    const [hours, minutes] = time.split(":");
    let period = "AM"; // افتراضي AM
    let hour = parseInt(hours, 10);

    if (hour >= 12) {
      period = "PM"; // إذا كانت الساعة أكبر أو تساوي 12، نستخدم PM
      if (hour > 12) {
        hour -= 12; // تحويل الساعة إذا كانت أكبر من 12
      }
    } else if (hour === 0) {
      hour = 12; // إذا كانت الساعة 0 (منتصف الليل)، نعرض 12 AM
    }

    return `${hour}:${minutes} ${period}`;
  }

useEffect(() => {
  console.log("Sending API request...");
  axios
    .get("https://test.ashlhal.com/api/shifts", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log("API request successful:", response.data);
      setData(response.data.data);
    })
    .catch((error) => {
      console.log("API request failed:", error.response.data.message);
    });
  console.log("API request sent.");
}, [token]);

  return (
    <div className="navbar">
      {Data.map((el) => (
        <div key={el.id} className="navbar-welcome">
          <h3 className="navbar-welcome-text">Welcome {el.employee_name}</h3>
        </div>
      ))}
      <ul className="navbar-shift-list">
        {Data.map((ele) => (
          <li key={ele.id} className="navbar-shift-item">
            <span className="navbar-shift-time">
              {convertTo12HourFormat(ele.from)}
            </span>
            <span className="navbar-shift-separator">-</span>
            <span className="navbar-shift-time">
              {convertTo12HourFormat(ele.to)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NavBar;
