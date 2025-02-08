import { useEffect, useState } from "react";
import axios from "axios";
import "../../Style/Admin/Shifts/Shifts.css";
import Loader from "../../Components/Loader/Loader"; // استيراد مكون Loader
import Swal from "sweetalert2"; // استيراد SweetAlert2
import moment from "moment"; // استيراد moment

function Shifts() {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]); // State لقائمة الموظفين
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State لعرض/إخفاء الموديل
  const [newShift, setNewShift] = useState({
    employee_id: "",
    from: "",
    to: "",
    day: "",
  }); // State لتخزين بيانات المناوبة الجديدة
  const [loading, setLoading] = useState(true); // حالة التحميل
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true); // بداية التحميل
      try {
        const response = await axios.get(
          "https://test.ashlhal.com/api/shifts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.data) {
          setShifts(response.data.data);
          setError(null);
        } else {
          throw new Error("Invalid response data");
        }

        console.log(response.data);
      } catch (error) {
        console.error("Error fetching shifts:", error);
        setError(`Error fetching shifts: ${error.message}`);
      }
    };

    const fetchEmployees = async () => {
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
          throw new Error("Invalid employees data");
        }

        console.log(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError(`Error fetching employees: ${error.message}`);
      }
    };

    const fetchData = async () => {
      // دالة لتجميع استدعاءات API
      await Promise.all([fetchShifts(), fetchEmployees()]); // انتظر حتى يتم جلب البيانات
      setLoading(false); // بعد انتهاء استدعاء كل الدوال، تم التحميل
    };

    fetchData(); // استدعاء الدالة المجمعة
  }, [token]);

  // دالة لتحويل الوقت إلى تنسيق 12 ساعة مع AM/PM
  const convertTo12Hour = (time24) => {
    if (!time24) return ""; // Check if the time is null or undefined

    // Check if the time24 is in correct format
    if (typeof time24 !== "string" || !/^\d{2}:\d{2}:\d{2}$/.test(time24)) {
      return "Invalid Time";
    }

    const [hours, minutes, seconds] = time24.split(":");
    let hours12 = parseInt(hours);
    const ampm = hours12 >= 12 ? "PM" : "AM";
    hours12 = hours12 % 12;
    hours12 = hours12 ? hours12 : 12; // إذا كان 0 يصبح 12

    const formattedHours = String(hours12).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
  };

  // دالة لتنسيق التاريخ والوقت باستخدام moment.js لعرض التاريخ والوقت بتنسيق 12 ساعة
  const formatTime12Hour = (dateTime) => {
    if (!dateTime) return "";
    return moment(dateTime).format("YYYY-MM-DD hh:mm A"); // تنسيق التاريخ والوقت إلى YYYY-MM-DD HH:mm AM/PM
  };

  // دالة لمعالجة النقر على زر "إضافة مناوبة"
  const handleAddShiftClick = () => {
    setShowModal(true); // عرض الموديل
  };

  // دالة لإغلاق الموديل
  const handleCloseModal = () => {
    setShowModal(false); // إخفاء الموديل
    setNewShift({ employee_id: "", from: "", to: "", day: "" }); // إعادة تهيئة بيانات المناوبة الجديدة
    setError(null);
  };

  // دالة لمعالجة تغيير قيمة حقل في النموذج
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShift((prevShift) => ({ ...prevShift, [name]: value }));
  };

  // دالة لمعالجة إرسال النموذج
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    try {
      // Send a POST request to the API endpoint to add the new shift
      const response = await axios.post(
        `https://test.ashlhal.com/api/shifts`, // Replace with your actual API endpoint
        newShift, // Send the new shift data in the request body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        // If the shift was added successfully, update the shifts list
        setShifts((prevShifts) => [...prevShifts, response.data.data]); // Assuming the API returns the new shift data in response.data.data
        handleCloseModal(); // Close the modal
        console.log("Shift added successfully");

        // Show success message using SweetAlert2
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Shift added successfully.",
        });
      } else {
        throw new Error(`Failed to add shift. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding shift:", error);
      setError(`Error adding shift: ${error.message}`);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Failed to add shift: ${error.message}`,
      });
    }
  };

  return (
    <>
      {loading && <Loader />} {/* عرض اللودر إذا كانت حالة التحميل صحيحة */}
      <h1 className="shifts-title">Shifts</h1>
      <button onClick={handleAddShiftClick} className="add-shifts">
        Add Shift
      </button>{" "}
      {/* إضافة زر "إضافة مناوبة" */}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && shifts.length > 0 ? ( // عرض المحتوى فقط إذا لم يكن هناك تحميل
        <div className="table-responsive mt-5">
          <table className="table table-bordered table-hover table-dark text-center">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>From-To</th>
                <th>Day</th>
                <th>Status</th>
                <th>Started At</th> {/* إضافة عمود Started At */}
                <th>Ended At</th> {/* إضافة عمود Ended At */}
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr key={shift.id}>
                  <td>{shift.employee_id}</td>
                  <td>{shift.employee_name}</td>
                  <td>
                    <div className="bg-danger rounded p-2">
                      <div>{convertTo12Hour(shift.from)}</div>
                      <div>{convertTo12Hour(shift.to)}</div>
                    </div>
                  </td>{" "}
                  {/* تحويل الوقت */}
                  <td>{shift.day}</td>
                  <td>{shift.status}</td>
                  <td>{formatTime12Hour(shift.started_at)}</td>{" "}
                  {/* عرض Started At بتنسيق 12 ساعة */}
                  <td>{formatTime12Hour(shift.ended_at)}</td>{" "}
                  {/* عرض Ended At بتنسيق 12 ساعة */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <div>Loading shifts data...</div> // رسالة التحميل القديمة
      )}
      {/* Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Shift</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                {/* Form */}
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="employee_id">Employee</label>
                    <select
                      className="form-control"
                      id="employee_id"
                      name="employee_id"
                      value={newShift.employee_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="from">From</label>
                    <input
                      type="time"
                      className="form-control"
                      id="from"
                      name="from"
                      value={newShift.from}
                      onChange={handleInputChange}
                      required
                    ></input>
                  </div>
                  <div className="form-group">
                    <label htmlFor="to">To</label>
                    <input
                      type="time"
                      className="form-control"
                      id="to"
                      name="to"
                      value={newShift.to}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="day">Day</label>
                    <select
                      className="form-control"
                      id="day"
                      name="day"
                      value={newShift.day}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Day</option>
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Add Shift
                  </button>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Shifts;
