import axios from "axios";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../../Components/Loader/Loader"; // استيراد مكون Loader
import Swal from "sweetalert2"; // استيراد SweetAlert2

function Profile() {
  const [Data, setData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ

  const token = JSON.parse(localStorage.getItem("AuthToken"));

  const API_ENDPOINT = "https://test.ashlhal.com/api/profile";
  const UPDATE_PROFILE_ENDPOINT = "https://test.ashlhal.com/api/update-profile";
  const SHIFTS_ENDPOINT = "https://test.ashlhal.com/api/shifts";
  const START_SHIFT_ENDPOINT = "https://test.ashlhal.com/api/shifts"; // **تم التحديث بنقطة النهاية**
  const END_SHIFT_ENDPOINT = "https://test.ashlhal.com/api/shifts"; // **تم التحديث بنقطة النهاية**

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // بداية التحميل
      setError(null); // مسح أي خطأ سابق
      try {
        // جلب بيانات الملف الشخصي
        const profileResponse = await axios.get(API_ENDPOINT, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileResponse.data && profileResponse.data.profile) {
          const profileData = profileResponse.data.profile;
          console.log(profileData);
          setData(profileData);
          setNewName(profileData.name || "");
          setNewDepartment(profileData.department?.name || "");
          setNewEmail(profileData.email || "");
        } else {
          throw new Error("Invalid profile data");
        }

        // جلب بيانات الورديات
        const shiftsResponse = await axios.get(SHIFTS_ENDPOINT, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (shiftsResponse.data && shiftsResponse.data.data) {
          console.log("Shifts Data:", shiftsResponse.data.data);
          setShifts(shiftsResponse.data.data);
        } else {
          throw new Error("Invalid shifts data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "An error occurred");
        Swal.fire({
          // عرض تنبيه بالخطأ باستخدام SweetAlert2
          icon: "error",
          title: "Error!",
          text: error.response?.data?.message || "An error occurred",
        });
      } finally {
        setLoading(false); // نهاية التحميل
      }
    };

    fetchData();
  }, [token]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setNewName(Data?.name || "");
    setNewDepartment(Data?.department?.name || "");
    setNewEmail(Data?.email || "");
    setNewImage(null);
  };

  const handleSaveClick = async () => {
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("email", newEmail);
    formData.append("department", newDepartment);
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      const response = await axios.post(UPDATE_PROFILE_ENDPOINT, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile updated successfully:", response.data);
      setData(response.data.profile);
      setIsEditing(false);
      // قم بإعادة جلب البيانات من واجهة برمجة التطبيقات
      const profileResponse = await axios.get(API_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (profileResponse.data && profileResponse.data.profile) {
        const profileData = profileResponse.data.profile;
        console.log(profileData);
        setData(profileData); // قم بتحديث البيانات بالبيانات الجديدة
        Swal.fire({
          // عرض تنبيه بالنجاح باستخدام SweetAlert2
          icon: "success",
          title: "Success!",
          text: response.data.message || "Profile updated successfully!",
        });
      } else {
        throw new Error("Invalid profile data after update");
      }
    } catch (error) {
      console.error("Error updating profile:", error.response.data.message);
      // يمكنك هنا عرض رسالة خطأ للمستخدم
      setError(error.response?.data?.message || "An error occurred"); // تعيين الخطأ
      Swal.fire({
        // عرض تنبيه بالخطأ باستخدام SweetAlert2
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "An error occurred!",
      });
    }
  };

  const handleImageChange = (event) => {
    setNewImage(event.target.files[0]);
  };

  // دالة لبدء الوردية
  const handleStartShift = (shiftId) => {
    // تم إزالة طلب الخادم مؤقتًا
    console.log(`Shift ${shiftId} started (locally)!`);
    // قم بتحديث قائمة الورديات بعد البدء
    //fetchShifts();
    Swal.fire({
      // عرض تنبيه بالنجاح باستخدام SweetAlert2
      icon: "success",
      title: "Success!",
      text: `Shift ${shiftId} started (locally)!`,
    });
  };

  // دالة لإنهاء الوردية
  const handleEndShift = (shiftId) => {
    // تم إزالة طلب الخادم مؤقتًا
    console.log(`Shift ${shiftId} ended (locally)!`);
    // قم بتحديث قائمة الورديات بعد الإنهاء
    //fetchShifts();
    Swal.fire({
      // عرض تنبيه بالنجاح باستخدام SweetAlert2
      icon: "success",
      title: "Success!",
      text: `Shift ${shiftId} ended (locally)!`,
    });
  };

  // دالة لجلب الورديات
  const fetchShifts = async () => {
    try {
      const response = await axios.get(SHIFTS_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShifts(response.data.data);
    } catch (error) {
      console.error(
        "Error fetching shifts:",
        error.response?.data?.message || error.message
      );
      setError(error.response?.data?.message || "An error occurred"); // تعيين الخطأ
      Swal.fire({
        // عرض تنبيه بالخطأ باستخدام SweetAlert2
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Error fetching shifts!",
      });
    }
  };

  // دالة لتحويل الوقت إلى تنسيق 12 ساعة مع AM/PM
  const convertTo12Hour = (time24) => {
    if (!time24) return "";

    const [hours, minutes] = time24.split(":");
    let period = "AM";
    let hour = parseInt(hours);

    if (hour >= 12) {
      period = "PM";
      if (hour > 12) {
        hour -= 12;
      }
    }

    if (hour === 0) {
      hour = 12; // منتصف الليل
    }

    return `${hour}:${minutes} ${period}`;
  };

  return (
    <div className="container mt-5">
      {loading && <Loader />}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card bg-dark text-white">
              <div className="card-body">
                {isEditing ? (
                  // فورم التعديل
                  <div>
                    <h5 className="card-title">Edit Profile</h5>
                    <div className="mb-3">
                      <label className="form-label">Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Department:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newDepartment}
                        onChange={(e) => setNewDepartment(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email:</label>
                      <input
                        type="email"
                        className="form-control"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Image:</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleImageChange}
                      />
                    </div>

                    <button
                      className="btn btn-primary me-2"
                      onClick={handleSaveClick}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancelClick}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // عرض معلومات الملف الشخصي
                  <div>
                    <h5 className="card-title">Profile Information</h5>
                    <div className="text-center mb-3">
                      {Data?.image ? (
                        <img
                          src={Data.image}
                          alt="Profile"
                          className="img-fluid rounded-circle"
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <p>No Image</p>
                      )}
                    </div>
                    <p className="card-text">
                      <strong>Name:</strong> {Data?.name}
                    </p>
                    <p className="card-text">
                      <strong>Department:</strong> {Data?.department?.name}
                    </p>
                    <p className="card-text">
                      <strong>Email:</strong> {Data?.email}
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={handleEditClick}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* جدول الورديات */}
            <div className="card mt-4 bg-dark">
              <div className="card-body">
                <h5 className="card-title">Shifts</h5>
                <div className="table-responsive">
                  <table className="table table-striped table-dark text-center">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Employee Name</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Day</th>
                        <th>Status</th>
                        <th>Action</th> {/* عمود الإجراءات */}
                      </tr>
                    </thead>
                    <tbody>
                      {shifts.map((shift) => (
                        <tr key={shift.id}>
                          <td>{shift.id}</td>
                          <td>{shift.employee_name}</td>
                          <td>{convertTo12Hour(shift.from)}</td>
                          <td>{convertTo12Hour(shift.to)}</td>
                          <td>{shift.day}</td>
                          <td>{shift.status}</td>
                          <td>
                            <button
                              className="btn btn-success btn-sm me-1"
                              onClick={() => handleStartShift(shift.id)}
                            >
                              Start
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleEndShift(shift.id)}
                            >
                              End
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
