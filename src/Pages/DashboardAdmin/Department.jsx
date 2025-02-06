import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../Style/Admin/Department/Department.css"; // تأكد من أن ملف CSS مرفق في المشروع
import Loader from "../../Components/Loader/Loader"; // استيراد مكون Loader

function Department() {
  const { id } = useParams(); // هذا هو اسم القسم
  const [departmentName, setDepartmentName] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // حالة التحميل
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchEmployeesByDepartment = async () => {
      setLoading(true); // بداية التحميل
      try {
        const response = await axios.post(
          `https://test.ashlhal.com/api/employees-by-department`,
          { department: id }, // إرسال اسم القسم من الرابط
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.department && response.data.employees) {
          setDepartmentName(response.data.department);
          setEmployees(response.data.employees);
          setError(null);
        } else {
          throw new Error("Invalid response data");
        }

        console.log(response.data);
      } catch (error) {
        console.error("Error fetching department and employees:", error);
        setError(
          `Error fetching department and employees: ${error.message} - ${
            error.response?.status || "Unknown Status"
          } - ${error.response?.data?.message || "No message"}`
        );
      } finally {
        setLoading(false); // نهاية التحميل
      }
    };

    fetchEmployeesByDepartment();
  }, [id, token]);

  const handleDeleteEmployee = async (employeeId) => {
    try {
      // Send a POST request to delete the employee
      const response = await axios.post(
        `https://test.ashlhal.com/api/delete-employee/${employeeId}`,
        {}, // Empty body, as the ID is in the URL
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // If deletion was successful, update the employees list
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee.id !== employeeId)
        );
        setError(null);
        console.log("Employee deleted successfully");
      } else {
        throw new Error("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError(`Error deleting employee: ${error.message}`);
    }
  };

  return (
    <>
      {loading && <Loader />} {/* عرض اللودر إذا كانت حالة التحميل صحيحة */}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && departmentName ? ( // عرض المحتوى فقط إذا لم يكن هناك تحميل
        <div>
          <h2 className="Department-title">Department: {departmentName}</h2>
          {employees.length > 0 ? (
            <div className="row">
              {employees.map((employee) => (
                <div className="col-md-3" key={employee.id}>
                  <div className="employee-de-card my-3">
                    <div>
                      <p>{employee.name}</p>
                    </div>
                    <div>
                      <button onClick={() => handleDeleteEmployee(employee.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No employees found in this department.</p>
          )}
        </div>
      ) : (
        !loading && !error && <div>Loading department data...</div> // عرض رسالة التحميل القديمة إذا لم يكن هناك تحميل أو خطأ
      )}
    </>
  );
}

export default Department;
