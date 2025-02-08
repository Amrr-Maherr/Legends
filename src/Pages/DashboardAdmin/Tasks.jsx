import React, { useEffect, useState } from "react";
import axios from "axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://test.ashlhal.com/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          setTasks(response.data.data);
          setError(null);
        } else {
          throw new Error("Invalid tasks data");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError(`Error fetching tasks: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  return (
    <>
      <h1 style={{ fontSize: "35px", color: "#FF4811" }}>Tasks</h1>
      {loading && <div>Loading tasks...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && tasks.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center table-dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Employee Name</th>
                <th>Status</th>
                <th>Description</th>
                <th>Image</th>
                <th>Condition</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.name}</td>
                  <td>{task.employee_name}</td>
                  <td>{task.status}</td>
                  <td>{task.description}</td>
                  <td>
                    <img
                      src={task.image}
                      alt={task.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td>{task.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <div>No tasks found.</div>
      )}
    </>
  );
}

export default Tasks;
