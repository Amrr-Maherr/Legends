import AddIcon from "../../Assets/addIcon.svg";
import "../../Style/Admin/AdminNavBar/Navbar.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // استيراد SweetAlert2

function Navbar() {
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [Data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [TaskName, setTaskName] = useState("");
  const [TaskText, setTaskText] = useState("");
  const [TaskEmployee, setTaskEmployee] = useState("");
  const [TaskImage, setTaskImage] = useState(null);
  const [TaskDeadline, setTaskDeadline] = useState(""); // حالة لـ Deadline

  useEffect(() => {
    axios
      .get("https://test.ashlhal.com/api/AllEmployees", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, [token]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !TaskName ||
      !TaskText ||
      !TaskEmployee ||
      !TaskImage ||
      !TaskDeadline
    ) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please fill in all fields.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", TaskName);
    formData.append("employee_id", TaskEmployee);
    formData.append("description", TaskText);
    formData.append("image", TaskImage); // إلحاق الملف بالـ FormData
    formData.append("deadline", TaskDeadline); // إضافة حقل Deadline

    try {
      const response = await axios.post(
        "https://test.ashlhal.com/api/tasks",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Task added successfully.",
        });
        handleCloseModal();
        // إعادة تهيئة الحقول بعد النجاح
        setTaskName("");
        setTaskText("");
        setTaskEmployee("");
        setTaskImage(null);
        setTaskDeadline("");
      } else {
        throw new Error(`Failed to add task. Status code: ${response.status}`);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error adding task: ${error.message}`,
      });
      console.error("Error adding task:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">
        <p>{Data.length}</p>
        <span>Employee</span>
      </div>
      <ul className="navbar-menu">
        <div
          onClick={handleShowModal}
          style={{ cursor: "pointer" }}
          className="d-flex align-items-center gap-2"
        >
          Add Shift
          <img src={AddIcon} alt="Add Task" />
        </div>
      </ul>

      {/* Modal */}
      <div
        className={`modal ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Task</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="taskName">Task Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="taskName"
                    name="name"
                    value={TaskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Enter task name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="employeeId">Employee</label>
                  <select
                    className="form-control"
                    id="employeeId"
                    name="employee_id"
                    value={TaskEmployee}
                    onChange={(e) => setTaskEmployee(e.target.value)}
                    required
                  >
                    <option value="">Select Employee</option>
                    {Data.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={TaskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    placeholder="Enter task description"
                    required
                  />
                </div>
                {/* حقل Deadline */}
                <div className="form-group">
                  <label htmlFor="deadline">Deadline</label>
                  <input
                    type="text"
                    className="form-control"
                    id="deadline"
                    name="deadline"
                    value={TaskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    placeholder="Enter deadline"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="image">Task Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    onChange={(e) => setTaskImage(e.target.files[0])}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
