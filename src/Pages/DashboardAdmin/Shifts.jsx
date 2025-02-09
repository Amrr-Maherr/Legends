import { useEffect, useState } from "react";
import axios from "axios";
import "../../Style/Admin/Shifts/Shifts.css";
import Loader from "../../Components/Loader/Loader";
import Swal from "sweetalert2";
import moment from "moment";

function Shifts() {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newShift, setNewShift] = useState({
    employee_id: "",
    from: "",
    to: "",
    day: "",
  });
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false); // Ensure loading is set to false after the API call
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
      try {
        await Promise.all([fetchShifts(), fetchEmployees()]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const convertTo12Hour = (time24) => {
    if (!time24) return "";
    if (typeof time24 !== "string" || !/^\d{2}:\d{2}:\d{2}$/.test(time24)) {
      return "Invalid Time";
    }

    const [hours, minutes, seconds] = time24.split(":");
    let hours12 = parseInt(hours);
    const ampm = hours12 >= 12 ? "PM" : "AM";
    hours12 = hours12 % 12;
    hours12 = hours12 ? hours12 : 12;

    const formattedHours = String(hours12).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
  };

  const formatTime12Hour = (dateTime) => {
    if (!dateTime) return "";

    // Check if the dateTime is a valid date
    if (!moment(dateTime).isValid()) {
      console.error("Invalid date time:", dateTime);
      return "Invalid Date";
    }

    // Extract the desired part of the string
    return dateTime.slice(0, 19).replace("T", " ");
  };

  const handleAddShiftClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewShift({ employee_id: "", from: "", to: "", day: "" });
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShift((prevShift) => ({ ...prevShift, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://test.ashlhal.com/api/shifts`,
        newShift,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setShifts((prevShifts) => [...prevShifts, response.data.data]);
        handleCloseModal();
        console.log("Shift added successfully");

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

  const daysOfWeek = [
    "saturday",
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ];

  return (
    <>
      {loading && <Loader />}
      <h1 className="shifts-title">Shifts</h1>
      <button onClick={handleAddShiftClick} className="add-shifts">
        Add Shift
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && shifts.length > 0 ? (
        <div className="table-responsive mt-5">
          <table className="table table-bordered table-hover table-dark text-center">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>From-To</th>
                <th>Day</th>
                <th>Status</th>
                <th>Started At</th>
                <th>Ended At</th>
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
                  </td>
                  <td>{shift.day}</td>
                  <td>{shift.status}</td>
                  <td>{formatTime12Hour(shift.started_at)}</td>
                  <td>{formatTime12Hour(shift.ended_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <div>No shifts data available.</div>
      )}

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
                    />
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
                      {daysOfWeek.map((day) => (
                        <option key={day} value={day}>
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </option>
                      ))}
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
