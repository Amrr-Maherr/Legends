import { useEffect, useState } from "react";
import "../../Style/Admin/Departments/Departments.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../../Components/Loader/Loader"; // استيراد مكون Loader

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true); // حالة التحميل
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    setLoading(true); // بداية التحميل
    axios
      .get("https://test.ashlhal.com/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setDepartments(response.data.departments); // تخزين الأقسام في الـ state
        console.log(response.data.departments);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      })
      .finally(() => {
        setLoading(false); // نهاية التحميل
      });
  }, [token]);

  // دالة لتحديد الأيقونة المناسبة لكل قسم
  const getDepartmentIcon = (departmentName) => {
    switch (departmentName) {
      case "Marketing":
        return "fa-bullhorn"; // أيقونة مكبر الصوت
      case "Sales":
        return "fa-line-chart"; // أيقونة رسم بياني للمبيعات
      case "Design":
        return "fa-paint-brush"; // أيقونة فرشاة الرسم
      case "Development":
        return "fa-code"; // أيقونة الكود
      case "Human Resource":
        return "fa-users"; // أيقونة مجموعة من المستخدمين
      case "Accounting and Finance":
        return "fa-money"; // أيقونة المال
      default:
        return "fa-building"; // أيقونة افتراضية للمبنى
    }
  };

  return (
    <>
      {loading && <Loader />} {/* عرض اللودر إذا كانت حالة التحميل صحيحة */}
      <section>
        <div className="container">
          <div className="row">
            {!loading &&
              departments.map((department) => (
                <div className="col-xl-4 col-md-4 col-12" key={department.id}>
                  <Link
                    to={`/admin-dashboard/department/${department.name}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="departments-card">
                      <i
                        className={`fa ${getDepartmentIcon(
                          department.name
                        )} department-icon`}
                      ></i>{" "}
                      {/* إضافة الأيقونة */}
                      {department.name}
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Departments;
