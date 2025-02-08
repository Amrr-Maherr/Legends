import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // استيراد Bootstrap CSS
import Swal from "sweetalert2"; // استيراد SweetAlert2

function EmployeeTaskDetails() {
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

  const handleDownloadImage = async () => {
    if (task && task.image) {
      try {
        const response = await axios.get(task.image, {
          responseType: "blob", // Important: Request the image as a Blob
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          task.name ? `${task.name}.png` : "task_image.png"
        ); // Set filename
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link); // Clean up
        window.URL.revokeObjectURL(url); // Release the object URL
      } catch (error) {
        console.error("Error downloading image:", error);
        alert("Failed to download image. Check the console for details."); // More informative alert
      }
    }
  };

  const handleReceiveTask = async () => {
    try {
      const response = await axios.post(
        `https://test.ashlhal.com/api/recieve-task/${id}`, // Replace with your actual API endpoint
        {}, // Empty body, as the ID is in the URL
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // If the task was received successfully, update the task state
        setTask((prevState) => ({ ...prevState, condition: "received" })); // Assuming the API returns the updated task
        setError(null);
        console.log("Task received successfully");

        // Show success message using SweetAlert2
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
                <p className="card-text">
                  <strong>Condition:</strong> {task.condition}
                </p>
                <p className="card-text">
                  <strong>Deadline:</strong> {task.deadline}
                </p>
                <div className="text-center">
                  <button
                    className="btn btn-primary"
                    onClick={handleDownloadImage}
                    disabled={!task.image}
                  >
                    Download Image
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
