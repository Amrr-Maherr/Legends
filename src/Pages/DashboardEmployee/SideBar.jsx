import "../../Style/Employee/SideBar/SideBar.css";
import LegendsLogo from "../../Components/LegendsLogo/LegendsLogo";
import { Link, useNavigate } from "react-router-dom"; // استيراد useNavigate
import axios from "axios"; // استيراد axios
import Swal from "sweetalert2"; // استيراد SweetAlert2

function SideBar() {
  const navigate = useNavigate(); // تهيئة useNavigate
  const token = JSON.parse(localStorage.getItem("AuthToken")); // استرداد الرمز المميز

  // دالة تسجيل الخروج
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://test.ashlhal.com/api/logout",
        {}, // يمكنك إرسال بيانات إضافية إذا لزم الأمر
        {
          headers: {
            Authorization: `Bearer ${token}`, // تضمين الرمز المميز
          },
        }
      );

      console.log("Logout successful:", response.data);
      // قم بإزالة الرمز المميز من Local Storage
      localStorage.removeItem("AuthToken");
      // قم بإعادة توجيه المستخدم إلى صفحة تسجيل الدخول
      navigate("/"); // أو أي مسار آخر
      Swal.fire({
        // عرض تنبيه بالنجاح باستخدام SweetAlert2
        icon: "success",
        title: "Success!",
        text: response.data.message || "Logout successful!",
      });
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
      // عرض رسالة خطأ للمستخدم إذا لزم الأمر
      Swal.fire({
        // عرض تنبيه بالخطأ باستخدام SweetAlert2
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Logout failed!",
      });
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <LegendsLogo />
      </div>
      <ul className="sidebar-links">
        <li>
          <Link to="/employee-dashboard/employee-home">
            <i className="fa fa-tachometer"></i>Dashboard
          </Link>
        </li>
        <li>
          <Link to="/employee-dashboard/employee-profile">
            <i className="fa fa-building"></i>Profile
          </Link>
        </li>
        <li>
          <Link to="/employee-dashboard/all-tasks">
            <i className="fa fa-tasks"></i> All Tasks
          </Link>
        </li>
        <li>
          <Link to="#" onClick={handleLogout}>
            {" "}
            {/* تغيير الرابط واستخدام onClick */}
            <i className="fa fa-sign-out"></i>Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
