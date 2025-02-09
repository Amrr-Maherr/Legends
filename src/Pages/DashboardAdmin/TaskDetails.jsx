import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2"; // استيراد SweetAlert

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const history = useNavigate();

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
          setName(response.data.data.name || "");
          setDescription(response.data.data.description || "");
          setError(null);
        } else {
          throw new Error("Invalid task data");
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
        setError("Failed to load task details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id, token]);

  const handleUpdateTask = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(
        `https://test.ashlhal.com/api/tasks/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.data) {
        console.log("Task updated successfully:", response.data.data);
        setTask(response.data.data);
        setIsEditing(false);

        // عرض رسالة النجاح باستخدام SweetAlert
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message || "Task updated successfully!", // استخدام رسالة السيرفر إذا كانت متاحة
          confirmButtonText: "OK",
        });
      } else {
        throw new Error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");

      // عرض رسالة الخطأ باستخدام SweetAlert
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update task. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center">Loading task details...</div>
      ) : task ? (
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
                {isEditing ? (
                  // عرض النموذج (Form)
                  <>
                    <p className="card-text">
                      <strong>Name:</strong>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </p>
                    <p className="card-text">
                      <strong>Description:</strong>
                      <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </p>
                    <p className="card-text">
                      <strong>Image:</strong>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                    </p>
                    <button
                      className="btn btn-success me-2"
                      onClick={handleUpdateTask}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  // عرض تفاصيل المهمة
                  <>
                    {task.image && (
                      <div className="text-center mb-3">
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
                      <strong>Deadline:</strong> {task.deadline}
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Task
                    </button>
                  </>
                )}
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
