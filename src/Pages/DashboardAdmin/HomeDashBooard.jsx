import axios from "axios";
import { useEffect, useState } from "react";
import "../../Style/Admin/HomeDashBoard/HomeDashBoard.css";
import taskIcon from "../../Assets/Vector.svg";
import { Link } from "react-router-dom";
import Loader from "../../Components/Loader/Loader"; // استيراد مكون Loader

function HomeDashBoard() {
  const [EmployeeData, setEmployeeData] = useState([]);
  const [TaskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeRating, setEmployeeRating] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskStatus, setTaskStatus] = useState(""); // حالة المهمة
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  // Get employees data
  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get("https://test.ashlhal.com/api/AllEmployees", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setEmployeeData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        setError(error.message || "An error occurred while fetching employees");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  // Get tasks data
  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get("https://test.ashlhal.com/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTaskData(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        setError(error.message || "An error occurred while fetching tasks");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeRating(employee.rating || 1);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setTaskStatus(task.status); // تهيئة حالة المهمة عند اختيارها
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setSelectedTask(null);
    setError(null);
  };

  const handleSaveRating = async () => {
    try {
      // بناء عنوان URL لنقطة النهاية مع تضمين معرف الموظف
      const apiUrl = `https://test.ashlhal.com/api/ratings/${selectedEmployee.id}`;

      // تجهيز البيانات التي سيتم إرسالها في الطلب
      const ratingData = {
        rating: employeeRating, // قيمة التقييم
      };

      // إرسال طلب POST إلى الـ API
      const response = await axios.post(apiUrl, ratingData, {
        headers: {
          Authorization: `Bearer ${token}`, // تضمين الـ Token في ترويسة الطلب
        },
      });

      // معالجة الاستجابة في حالة النجاح
      if (response.status === 200 || response.status === 201) {
        // يمكنك هنا تحديث حالة الموظف في واجهة المستخدم إذا لزم الأمر
        // على سبيل المثال، يمكنك تحديث EmployeeData لتعكس التقييم الجديد
        console.log("تم حفظ التقييم بنجاح!");
        handleCloseModal(); // إغلاق الموديل بعد الحفظ بنجاح
      } else {
        // في حالة وجود حالة خطأ غير متوقعة في الاستجابة
        console.error("حدث خطأ أثناء حفظ التقييم:", response.data);
        setError("حدث خطأ أثناء حفظ التقييم."); // تعيين رسالة الخطأ
      }
    } catch (error) {
      // معالجة الأخطاء التي قد تحدث أثناء الطلب (مثل خطأ في الشبكة أو خطأ من الـ API)
      console.error("حدث خطأ أثناء إرسال التقييم:", error);
      setError("فشل حفظ التقييم. يرجى المحاولة مرة أخرى."); // تعيين رسالة الخطأ
    }
  };

  const handleUpdateTaskStatus = async () => {
    try {
      // بناء عنوان URL لنقطة النهاية مع تضمين معرف المهمة
      const apiUrl = `https://test.ashlhal.com/api/update-status/${selectedTask.id}`;

      // تجهيز البيانات التي سيتم إرسالها في الطلب
      const statusData = {
        status: taskStatus, // قيمة الحالة الجديدة
      };

      // إرسال طلب PUT إلى الـ API
      const response = await axios.put(apiUrl, statusData, {
        headers: {
          Authorization: `Bearer ${token}`, // تضمين الـ Token في ترويسة الطلب
        },
      });

      // معالجة الاستجابة في حالة النجاح
      if (response.status === 200 || response.status === 201) {
        // يمكنك هنا تحديث حالة المهمة في واجهة المستخدم إذا لزم الأمر
        // على سبيل المثال، يمكنك تحديث TaskData لتعكس الحالة الجديدة
        console.log("تم تحديث حالة المهمة بنجاح!");
        handleCloseModal(); // إغلاق الموديل بعد التحديث بنجاح
      } else {
        // في حالة وجود حالة خطأ غير متوقعة في الاستجابة
        console.error("حدث خطأ أثناء تحديث حالة المهمة:", response.data);
        setError("حدث خطأ أثناء تحديث حالة المهمة."); // تعيين رسالة الخطأ
      }
    } catch (error) {
      // معالجة الأخطاء التي قد تحدث أثناء الطلب (مثل خطأ في الشبكة أو خطأ من الـ API)
      console.error("حدث خطأ أثناء إرسال تحديث الحالة:", error);
      setError("فشل تحديث حالة المهمة. يرجى المحاولة مرة أخرى."); // تعيين رسالة الخطأ
    }
  };

  return (
    <>
      {loading && <Loader />} {/* عرض اللودر إذا كانت حالة التحميل صحيحة */}
      <section>
        <div className="container p-0">
          <div className="row ">
            {/* Employees Column */}
            <div className="col-8 p-4 employee-col">
              <h1 className="employees-title">Employees</h1>
              {/* {loading && <div>Loading employees...</div>} */}{" "}
              {/* تم استبداله باللودر العام */}
              {error && <div>Error: {error}</div>}
              {!loading && !error && (
                <div className="row">
                  {EmployeeData.map((employee) => (
                    <div
                      key={employee.id}
                      className="col-12 col-sm-6 col-md-6 col-lg-6 mb-3"
                    >
                      <div
                        className="card employee-card-inner"
                        onClick={() => handleEmployeeClick(employee)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="card-head">
                          <img
                            src={employee.image}
                            alt={employee.name}
                            className="card-img-top employee-img"
                          />
                          <h5 className="card-title employee-name">
                            {employee.name}
                          </h5>
                          <i className="fa fa-ellipsis-h rateEmployee-icon"></i>
                        </div>
                        <div className="card-body employee-card-body">
                          <p className="card-text employee-position">
                            Department: {employee.department?.name}
                          </p>
                          <p className="card-text employee-position">
                            Email: {employee.email}
                          </p>
                          <p className="card-text employee-position">
                            Phone: {employee.phone}
                          </p>
                          <p className="card-text employee-position">
                            Bank Account: {employee.bank_account}
                          </p>
                          <p className="card-text employee-position">
                            Role: {employee.role}
                          </p>
                          <p className="card-text employee-position">
                            Rate: {employee.rating}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="col-4 p-4 task-col">
              <h1 className="tasks-title">Tasks</h1>
              {/* {loading && <div>Loading tasks...</div>} */}{" "}
              {/* تم استبداله باللودر العام */}
              {error && <div>Error: {error}</div>}
              {!loading && !error && (
                <div className="list-group task-list">
                  {TaskData.map((task) => (
                    <div
                      key={task.id}
                      className="list-group-item task-item mb-3"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="tass-info">
                        <Link
                          to={`/admin-dashboard/task-details/${task.id}`}
                          style={{ textDecoration: "none", color: "#FFFFFF" }}
                        >
                          <h5
                            className="task-title mb-1"
                            style={{ fontSize: "14px", color: "#FF4811B2" }}
                          >
                            <span style={{ fontSize: "14px" }}>Name:</span>
                            {task.name}
                          </h5>
                        </Link>
                        <p className="task-description mb-1">
                          <span>Details:</span>
                          {task.description?.slice(0, 10)} more...
                        </p>
                        <small className="task-assigned">
                          <span>Team:</span> {task.employee_name}
                        </small>
                        <img
                          className="taskIcon"
                          src={taskIcon}
                          alt=""
                          onClick={() => handleTaskClick(task)}
                        />
                      </div>
                      <div>
                        <img src={task.image} alt="" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Employee Modal */}
      {selectedEmployee && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedEmployee.name}</h5>
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
                <p>Email: {selectedEmployee.email}</p>
                <div className="form-group">
                  <label htmlFor="employeeRating">Rating (1-5):</label>
                  <input
                    type="number"
                    className="form-control"
                    id="employeeRating"
                    min="1"
                    max="5"
                    value={employeeRating}
                    onChange={(e) =>
                      setEmployeeRating(parseInt(e.target.value))
                    }
                  />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveRating}
                >
                  Save Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Task Modal */}
      {selectedTask && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedTask.name}</h5>
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
                <p>Description: {selectedTask.description}</p>
                {/* حقل تغيير الحالة */}
                <div className="form-group">
                  <label htmlFor="taskStatus">Status:</label>
                  <select
                    className="form-control"
                    id="taskStatus"
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateTaskStatus}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HomeDashBoard;