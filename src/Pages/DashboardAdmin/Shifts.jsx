import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import moment from "moment";
import Loader from "../../../src/Components/Loader/Loader";

function Shifts() {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("AuthToken"))
  );
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newShift, setNewShift] = useState({
    employee_id: "",
    from: "",
    to: "",
    day: "",
  });
  const [employees, setEmployees] = useState([]);
  const daysOfWeek = [
    "saturday",
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ];

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("https://test.ashlhal.com/api/shifts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Shifts Data:", response.data.data); // Detailed log
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shifts:", error); // Detailed error log
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Failed to fetch shifts: ${error.message}`,
      });
      setLoading(true);
    }
  }, [token]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://test.ashlhal.com/api/AllEmployees",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmployees(response.data); // Store employees in state
      console.log("Employees Data:", response.data); // Detailed log
    } catch (error) {
      console.error("Error fetching employees:", error); // Detailed error log
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Failed to fetch employees: ${error.message}`,
      });
    }
  }, [token]);

  useEffect(() => {
    fetchData();
    fetchEmployees(); // Fetch employees on component mount
  }, [token, fetchData, fetchEmployees]);

  const handleAddShiftClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewShift({ employee_id: "", from: "", to: "", day: "" });
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewShift((prevShift) => ({ ...prevShift, [name]: value }));
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loading

    try {
      const response = await axios.post(
        "https://test.ashlhal.com/api/shifts",
        newShift,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Shift added successfully.",
        });
        fetchData(); // Refresh shifts after adding
        handleCloseModal();
      } else {
        console.error("Failed to add shift:", response); // Detailed error log
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: `Failed to add shift. Status code: ${response.status}`,
        });
      }
    } catch (error) {
      console.error("Error adding shift:", error); // Detailed error log
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Failed to add shift: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false); // End loading
    }
  };

  const handleDeleteShift = useCallback(
    async (shiftId) => {
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
          setIsSubmitting(true); // Start loading
          try {
            const response = await axios.delete(
              `https://test.ashlhal.com/api/shifts/${shiftId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (response.status === 200 || response.status === 204) {
              Swal.fire("Deleted!", "Your shift has been deleted.", "success");
              fetchData(); // Refresh shifts after deleting
            } else {
              console.error("Failed to delete shift:", response); // Detailed error log
              Swal.fire({
                icon: "error",
                title: "Error!",
                text: `Failed to delete shift. Status code: ${response.status}`,
              });
            }
          } catch (error) {
            console.error("Error deleting shift:", error); // Detailed error log
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: `Failed to delete shift: ${error.message}`,
            });
          } finally {
            setIsSubmitting(false); // End loading
          }
        }
      });
    },
    [token, fetchData]
  );

  const formatTime = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    let utcHours = date.getUTCHours();
    let utcMinutes = date.getUTCMinutes();

    // Convert UTC to local time
    let localHours = utcHours;
    let localMinutes = utcMinutes;

    const ampm = localHours >= 12 ? "PM" : "AM";
    localHours = localHours % 12;
    localHours = localHours ? localHours : 12; // the hour '0' should be '12'
    const minutesStr = localMinutes < 10 ? "0" + localMinutes : localMinutes;

    // Format the date
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    return {
      time: `${localHours}:${minutesStr} ${ampm}`,
      date: formattedDate,
    };
  };

  // Function to convert 24-hour time to 12-hour time with AM/PM
  const convertTo12Hour = (time24) => {
    if (!time24) return "";

    const [hours, minutes] = time24.split(":").map(Number);
    let hours12 = hours % 12;
    hours12 = hours12 === 0 ? 12 : hours12; // the hour '0' should be '12'
    const ampm = hours < 12 ? "AM" : "PM";

    return `${hours12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  // Style object for table cells to avoid repetition
  const cellStyle = {
    fontSize: "22px",
    color: "white",
    fontWeight: "300",
    backgroundColor: "black",
    borderBottom: "none",
    padding: "15px",
  };

  return (
    <>
      <section>
        <div className="container">
          {loading ? (
            <>
              <Loader />
            </>
          ) : (
            <>
              <div className="row">
                <div className="col-12 my-5">
                  <button
                    className="btn"
                    style={{ backgroundColor: "#FF4811" }}
                    onClick={handleAddShiftClick}
                  >
                    Add Shift
                  </button>
                </div>
                <div className="col-12">
                  <div className="table table-responsive">
                    <table
                      className="table table-hover text-center"
                      style={{ backgroundColor: "black", border: "none" }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              fontSize: "32px",
                              color: "#FF4811",
                              fontWeight: "300",
                              backgroundColor: "black",
                              borderBottom: "none",
                              padding: "15px",
                            }}
                            scope="col"
                          >
                            Name
                          </th>
                          <th
                            style={{
                              fontSize: "32px",
                              color: "#FF4811",
                              fontWeight: "300",
                              backgroundColor: "black",
                              borderBottom: "none",
                              padding: "15px",
                            }}
                            scope="col"
                          >
                            Shift
                          </th>
                          <th
                            style={{
                              fontSize: "32px",
                              color: "#FF4811",
                              fontWeight: "300",
                              backgroundColor: "black",
                              borderBottom: "none",
                              padding: "15px",
                            }}
                            scope="col"
                          >
                            From-To
                          </th>
                          <th
                            style={{
                              fontSize: "32px",
                              color: "#FF4811",
                              fontWeight: "300",
                              backgroundColor: "black",
                              borderBottom: "none",
                              padding: "15px",
                            }}
                            scope="col"
                          >
                            Day
                          </th>
                          <th
                            style={{
                              fontSize: "32px",
                              color: "#FF4811",
                              fontWeight: "300",
                              backgroundColor: "black",
                              borderBottom: "none",
                              padding: "15px",
                            }}
                            scope="col"
                          >
                            Status
                          </th>
                          <th
                            style={{
                              fontSize: "32px",
                              color: "#FF4811",
                              fontWeight: "300",
                              backgroundColor: "black",
                              borderBottom: "none",
                              padding: "15px",
                            }}
                            scope="col"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Data.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={cellStyle}>
                              No shifts available.
                            </td>
                          </tr>
                        ) : (
                          <>
                            {Data.map((shift) => (
                              <tr key={shift.id}>
                                <td style={cellStyle}>{shift.employee_name}</td>
                                <td
                                  style={{
                                    ...cellStyle,
                                    display: "flex",
                                  }}
                                >
                                  <div className="w-50 mx-auto">
                                    <p
                                      style={{
                                        backgroundColor: "#00695c",
                                        margin: "0",
                                        padding: "10px",
                                        borderTopLeftRadius: "8px",
                                        borderTopRightRadius: "8px",
                                      }}
                                    >
                                      Begin
                                    </p>
                                    <p
                                      style={{
                                        backgroundColor: "#333333",
                                        margin: "0",
                                        padding: "10px",
                                      }}
                                    >
                                      {formatTime(shift.started_at)?.time}
                                      <br /> {/* Add line break */}
                                      {formatTime(shift.started_at)?.date}
                                    </p>
                                  </div>
                                  <div className="w-50 mx-3">
                                    <p
                                      style={{
                                        backgroundColor: "#004d60",
                                        margin: "0",
                                        padding: "10px",
                                        borderTopLeftRadius: "8px",
                                        borderTopRightRadius: "8px",
                                      }}
                                    >
                                      End
                                    </p>
                                    <p
                                      style={{
                                        backgroundColor: "#333333",
                                        margin: "0",
                                        padding: "10px",
                                      }}
                                    >
                                      {formatTime(shift.ended_at)?.time}
                                      <br /> {/* Add line break */}
                                      {formatTime(shift.ended_at)?.date}
                                    </p>
                                  </div>
                                </td>
                                <td style={cellStyle}>
                                  <div
                                    style={{
                                      backgroundColor: "#00695c",
                                      margin: "0",
                                      padding: "10px",
                                      borderTopLeftRadius: "8px",
                                      borderTopRightRadius: "8px",
                                    }}
                                  >
                                    {convertTo12Hour(shift.from)}
                                  </div>
                                  <div
                                    style={{
                                      backgroundColor: "#004d60",
                                      margin: "0",
                                      padding: "10px",
                                    }}
                                  >
                                    {convertTo12Hour(shift.to)}
                                  </div>
                                </td>
                                <td style={cellStyle}>{shift.day}</td>
                                <td style={cellStyle}>{shift.status}</td>
                                <td style={cellStyle}>
                                  <button
                                    style={{
                                      background: "none",
                                      border: "none",
                                      color: "white",
                                      cursor: "pointer",
                                      fontSize: "22px",
                                    }}
                                    onClick={() => handleDeleteShift(shift.id)}
                                    disabled={isSubmitting}
                                  >
                                    <i
                                      style={{ color: "#FF4811" }}
                                      className="fa fa-trash"
                                      aria-hidden="true"
                                    ></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Shift</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={handleCloseModal}
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
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Shift"}
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Shifts;
