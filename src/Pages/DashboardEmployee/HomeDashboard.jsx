import { useEffect, useState } from "react";
import axios from "axios";
import "../../Style/Employee/HomeDashboard/HomeDashboard.css";
import { Line } from "react-chartjs-2"; // استيراد Line Chart من Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement, // إضافة PointElement
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";
import Loader from "../../Components/Loader/Loader"; // استيراد مكون Loader

// إعدادات Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function HomeDashboard() {
  const [TasksData, setTasksData] = useState([]);
  const [Data, setData] = useState({});
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // بداية التحميل
      setError(null); // مسح أي خطأ سابق
      try {
        // جلب بيانات المهام
        const tasksResponse = await axios.get(
          "https://test.ashlhal.com/api/tasks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(tasksResponse.data.data);
        setTasksData(tasksResponse.data.data);

        // جلب البيانات الموجزة
        const summaryResponse = await axios.get(
          "https://test.ashlhal.com/api/employee/home",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(summaryResponse.data);
        setData(summaryResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false); // نهاية التحميل
      }
    };

    fetchData();
  }, [token]);

  // إعدادات البيانات للرسم البياني
  const chartData = {
    labels: ["Total Missions", "Completed Missions", "Pending Missions"], // التصنيفات على المحور الأفقي
    datasets: [
      {
        label: "Tasks Count",
        data: [
          Data?.["All tasks"] || 0,
          Data?.["completed tasks"] || 0,
          Data?.["pending tasks"] || 0,
        ],
        fill: false, // عدم ملء المساحة تحت الخط
        borderColor: "#FF4811E5", // اللون الخاص بالخط
        tension: 0.4, // التحكم في انحناء الخط
        borderWidth: 2, // عرض الخط
      },
    ],
  };

  return (
    <>
      {loading && <Loader />} {/* عرض اللودر إذا كانت حالة التحميل صحيحة */}
      <section>
        <div className="container p-0">
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading &&
            !error && ( // عرض المحتوى فقط إذا لم يكن هناك تحميل أو خطأ
              <div className="row">
                <div className="col-xl-8 my-home">
                  <div className="task-stats my-3 d-flex justify-content-between">
                    <div className="one">
                      <h3>Total Missions : {Data?.["All tasks"] || 0}</h3>
                    </div>
                    <div className="two">
                      <h3>
                        Completed Missions: {Data?.["completed tasks"] || 0}
                      </h3>
                    </div>
                    <div className="three">
                      <h3>Pending Missions: {Data?.["pending tasks"] || 0}</h3>
                    </div>
                  </div>
                  {TasksData.map((task) => (
                    <>
                      <div
                        className="my-4 task-description d-flex align-items-center justify-content-between p-3 rounded text-white"
                        style={{ backgroundColor: "#101013" }}
                      >
                        <div>
                          <div className="description">
                            <p>Task Description: {task.description}</p>
                          </div>
                        </div>
                        <div style={{ height: "50px", width: "50px" }}>
                          <img
                            src={task.image}
                            alt=""
                            style={{ height: "100%", width: "100%" }}
                          />
                        </div>
                      </div>
                    </>
                  ))}
                  <div className="chart" style={{ height: "400px" }}>
                    <Line
                      data={chartData}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </div>
                <div className="col-xl-4 my-tasks-col">
                  {TasksData.map((task) => (
                    <div
                      className="my-tasks-card"
                      key={task.id}
                      style={{ position: "relative" }}
                    >
                      <Link
                        to={`/employee-dashboard/employee-task-details/${task.id}`}
                        style={{
                          textDecoration: "none",
                          color: "#FF4811B2",
                          fontSize: "25px",
                        }}
                      >
                        <i
                          className="fa fa-eye"
                          style={{ position: "absolute", right: "15px" }}
                        ></i>
                      </Link>
                      <h6>
                        <strong
                          style={{ fontSize: "20px", fontWeight: "bold" }}
                        >
                          Description
                        </strong>
                        : {task.description}
                      </h6>
                      <p>
                        <strong
                          style={{ fontSize: "20px", fontWeight: "bold" }}
                        >
                          Status
                        </strong>
                        : {task.status}
                      </p>
                      <span>
                        <strong
                          style={{ fontSize: "20px", fontWeight: "bold" }}
                        >
                          Team
                        </strong>
                        : {task.employee_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </section>
    </>
  );
}

export default HomeDashboard;
