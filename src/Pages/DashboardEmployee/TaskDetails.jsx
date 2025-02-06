import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../Style/Admin/TaskDetails/TaskDetails.css"; // تأكد من وجود هذا الملف
import Loader from "../../Components/Loader/Loader"; // استيراد مكون Loader

function TaskDetails() {
  const { id } = useParams(); // استخراج معرف المهمة من الرابط
  const [task, setTask] = useState(null); // حالة لتخزين بيانات المهمة
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchTaskDetails = async () => {
      setLoading(true); // بداية التحميل
      setError(null); // مسح أي خطأ سابق
      try {
        const response = await axios.get(
          `https://test.ashlhal.com/api/tasks/${id}`, // بناء عنوان URL بشكل صحيح
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.data) {
          setTask(response.data.data); // تخزين بيانات المهمة
          console.log(response.data.data); // طباعة البيانات في وحدة التحكم
        } else {
          throw new Error("Task not found or invalid response");
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
        setError(
          `Error fetching task details: ${error.message} - ${
            error.response?.status || "Unknown Status"
          } - ${error.response?.data?.message || "No message"}`
        );
      } finally {
        setLoading(false); // نهاية التحميل
      }
    };

    fetchTaskDetails();
  }, [id, token]);

  return (
    <>
      {loading && <Loader />} {/* عرض اللودر إذا كانت حالة التحميل صحيحة */}
      <section>
        <div className="container">
          <div className="row">
            <div className="Task-Details">
              {error && <div className="alert alert-danger">{error}</div>}
              {!loading && task ? ( // عرض بيانات المهمة إذا لم يكن هناك تحميل أو خطأ
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{task.name}</h5>
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
                    <img
                      src={task.image}
                      alt={task.name}
                      className="img-fluid" // صورة مستجيبة
                    />
                  </div>
                </div>
              ) : (
                !loading && !error && <div>Task not found</div> // رسالة إذا لم يتم العثور على المهمة
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default TaskDetails;
