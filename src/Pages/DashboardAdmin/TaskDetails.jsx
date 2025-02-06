import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // استيراد Bootstrap CSS

function TaskDetails() {
  const { id } = useParams(); // استخراج الـ id من الـ URL
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(
          `https://test.ashlhal.com/api/tasks/${id}`, // Replace with your actual API endpoint
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.data) {
          console.log("API Response Data:", response.data.data); // Display the response data in the console
          setTask(response.data.data);
          setError(null);
        } else {
          throw new Error("Invalid task data");
        }

        console.log(response.data);
      } catch (error) {
        console.error("Error fetching task details:", error);
        setError(`Error fetching task details: ${error.message}`);
      }
    };

    fetchTaskDetails();
  }, [id, token]);

  return (
    <div className="container mt-5">
      {" "}
      {/* إضافة هامش علوي */}
      {error && <div className="alert alert-danger">{error}</div>}
      {task ? (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              {" "}
              {/* إضافة ظل خفيف للبطاقة */}
              <div
                className="card-header"
                style={{
                  backgroundColor: "#343a40",
                  color: "#FF4811",
                  borderBottom: "2px solid #FF4811",
                }}
              >
                {" "}
                {/* رأس البطاقة بلون أسود مع خط سفلي برتقالي */}
                <h2 className="card-title mb-0">Task Details</h2>{" "}
                {/* عنوان البطاقة */}
              </div>
              <div className="card-body bg-dark text-white">
                {task.image && (
                  <div className="text-center mb-3">
                    {" "}
                    {/* إضافة هامش سفلي للصورة */}
                    <img
                      src={task.image}
                      alt={task.name}
                      className="img-fluid rounded"
                      style={{
                        width: "500px",
                        Height: "500px",
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

export default TaskDetails;
