import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS for styling
import { Link } from "react-router-dom";

function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("https://test.ashlhal.com/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data.data)) {
          setTasks(response.data.data); // Access the 'data' array
          setError(null);
        } else {
          throw new Error("Invalid tasks data");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError(`Error fetching tasks: ${error.message}`);
        setTasks([]); // Ensure tasks is empty in case of error
      }
    };

    fetchTasks();
  }, [token]);

  return (
    <div className="container mt-5">
      <h2 style={{ fontSize: "32px", color: "#FF4811" }}>All Tasks</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {tasks.length > 0 ? (
        <div className="row">
          {tasks.map((task) => (
            <div className="col-md-4 mb-4" key={task.id}>
              <Link
                to={`/employee-dashboard/employee-task-details/${task.id}`}
                style={{ textDecoration: "none" }}
              >
                <div className="card bg-dark text-white">
                  <img
                    src={task.image}
                    className="card-img-top"
                    alt={task.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{task.name}</h5>
                    <p className="card-text">{task.description}</p>
                    <p className="card-text">
                      <strong>Employee:</strong> {task.employee_name}
                    </p>
                    <p className="card-text">
                      <strong>Status:</strong> {task.status}
                    </p>
                    <p className="card-text">
                      <strong>Condition:</strong> {task.condition}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
}

export default AllTasks;
