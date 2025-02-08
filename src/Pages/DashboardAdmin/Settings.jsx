import { useEffect, useState } from "react";
import axios from "axios";
import "../../Style/Admin/Settings/Settings.css";
import Loader from "../../Components/Loader/Loader"; // استيراد مكون Loader
import Swal from "sweetalert2"; // استيراد SweetAlert2

function Settings() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // حالة التحميل
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  const fetchEmployees = async () => {
    setLoading(true); // بداية التحميل
    try {
      const response = await axios.get(
        "https://test.ashlhal.com/api/AllEmployees",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setEmployees(response.data);
        setError(null);
      } else {
        throw new Error("Invalid employee data");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError(`Error fetching employees: ${error.message}`);
    } finally {
      setLoading(false); // نهاية التحميل
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  const handleDeleteEmployee = async (employeeId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `https://test.ashlhal.com/api/delete-employee/${employeeId}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.status === 200) {
            setEmployees((prevEmployees) =>
              prevEmployees.filter((employee) => employee.id !== employeeId)
            );
            setError(null);
            console.log("Employee deleted successfully");

            Swal.fire("Deleted!", "Employee has been deleted.", "success");
          } else {
            throw new Error(
              `Failed to delete employee. Status: ${response.status}`
            );
          }
        } catch (error) {
          console.error("Error deleting employee:", error);
          setError(`Error deleting employee: ${error.message}`);
          Swal.fire(
            "Error!",
            `Failed to delete employee: ${error.message}`,
            "error"
          );
        }
      }
    });
  };

  return (
    <>
      {loading && <Loader />} {/* عرض اللودر إذا كانت حالة التحميل صحيحة */}
      <h2 className="Settings-title">Employee List</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && ( // عرض المحتوى فقط إذا لم يكن هناك تحميل
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center table-dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default Settings;
