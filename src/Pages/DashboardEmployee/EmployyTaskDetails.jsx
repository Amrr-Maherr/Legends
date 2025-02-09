import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function EmployeeTaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(
          `https://test.ashlhal.com/api/tasks/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.data) {
          console.log("API Response Data:", response.data.data);
          setTask(response.data.data);
          setError(null);
        } else {
          throw new Error("Invalid task data");
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
        setError(`Error fetching task details: ${error.message}`);
      }
    };

    fetchTaskDetails();
  }, [id, token]);

  const handleOpenImageInNewTab = () => {
    if (task && task.image) {
      window.open(task.image, "_blank");
    }
  };

  const handleReceiveTask = async () => {
    try {
      const response = await axios.post(
        `https://test.ashlhal.com/api/recieve-task/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setTask((prevState) => ({ ...prevState, condition: "received" }));
        setError(null);
        console.log("Task received successfully");

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Task received successfully.",
        });
      } else {
        throw new Error(
          `Failed to receive task. Status code: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error receiving task:", error);
      setError(`Error receiving task: ${error.message}`);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Failed to receive task: ${error.message}`,
      });
    }
  };

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}
      {task ? (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div
                className="card-header"
                style={{
                  backgroundColor: "#343a40",
                  color: "#FF4811",
                  borderBottom: "2px solid #FF4811",
                }}
              >
                <h2 className="card-title mb-0">Task Details</h2>
              </div>
              <div className="card-body bg-dark text-white">
                {task.image && (
                  <div className="text-center mb-3">
                    <img
                      src={task.image}
                      alt={task.name}
                      className="img-fluid rounded"
                      style={{
                        width: "500px",
                        height: "500px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
                <p className="card-text">
                  <strong>Name:</strong> {task.name}
                </p>
                <p className="card-text">
                  <strong>Description:</strong> {task.description}
                </p>
                <p className="card-text">
                  <strong>Employee Name:</strong> {task.employee_name}
                </p>
                <p className="card-text">
                  <strong>Status:</strong> {task.status}
                </p>
                <p className="card-text">
                  <strong>Condition:</strong> {task.condition}
                </p>
                <p className="card-text">
                  <strong>Deadline:</strong> {task.deadline}
                </p>
                <div className="text-center">
                  <button
                    className="btn btn-primary"
                    onClick={handleOpenImageInNewTab}
                    disabled={!task.image}
                  >
                    Open Image
                  </button>
                  <button
                    className="btn text-white btn-info mx-3"
                    onClick={handleReceiveTask}
                  >
                    Receive Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">Loading task details...</div>
      )}
    </div>
  );
}

export default EmployeeTaskDetails;
