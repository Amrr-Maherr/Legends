import AddIcon from "../../Assets/addIcon.svg";
import "../../Style/Admin/AdminNavBar/Navbar.css";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [Data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [TaskName,setTaskName] = useState("")
  const [TaskText,setTaskText] = useState("")
  const [TaskEmployee,setTaskEmployee] = useState("")
  const [TaskImage,setTaskImage] = useState("")

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

  const handleSubmit = (e) => {
    e.preventDefault();
      if (!TaskName || !TaskText || !TaskEmployee || !TaskImage) {
          alert("")
      } else {
          const FormData = {
            name: TaskName,
            employee_id: TaskEmployee,
            description: TaskText,
            image: TaskImage,
          };
          axios
            .post("https://test.ashlhal.com/api/tasks", FormData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              alert("yes");
              handleCloseModal();
            })
            .catch((error) => {
              alert("Error adding task");
              console.error(error.response.data.message);
            });
      }
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">
        <p>{Data.length}</p>
        <span>Employee</span>
      </div>
      <ul className="navbar-menu">
        <img src={AddIcon} alt="Add Task" onClick={handleShowModal} />
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
                <span aria-hidden="true">&times;</span>
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
                    name="taskName"
                    value={TaskName}
                    onChange={(event) => {
                      setTaskName(event.target.value);
                    }}
                    placeholder="Enter task name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="employeeId">Employee ID</label>
                  <select
                    onChange={(event) => {
                      setTaskEmployee(event.target.value);
                    }}
                    className="form-control"
                    id="employeeId"
                    name="employeeId"
                    value={TaskEmployee}
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
                    onChange={(event) => {
                      setTaskText(event.target.value);
                    }}
                    placeholder="Enter task description"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="image">Task Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    onChange={(event) => {
                      setTaskImage(event.target.files[0]);
                    }}
                  />
                </div>
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
              <button
                type="submit"
                className="btn btn-primar"
                onClick={(event) => {
                  handleSubmit(event);
                }}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
