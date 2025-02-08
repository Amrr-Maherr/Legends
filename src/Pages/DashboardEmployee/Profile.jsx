import axios from "axios";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../../Components/Loader/Loader";
import Swal from "sweetalert2";

function Profile() {
  const [Data, setData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newBankAccount, setNewBankAccount] = useState(""); // حالة جديدة لـ Bank Account
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const API_BASE_URL = "https://test.ashlhal.com/api";
  const API_ENDPOINT = `${API_BASE_URL}/profile`;
  const UPDATE_PROFILE_ENDPOINT = `${API_BASE_URL}/update-profile`;
  const SHIFTS_ENDPOINT = `${API_BASE_URL}/shifts`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
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
          setNewBankAccount(profileData.bank_account || ""); // تعيين قيمة أولية لـ Bank Account
        } else {
          throw new Error("Invalid profile data");
        }

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
          icon: "error",
          title: "Error!",
          text: error.response?.data?.message || "An error occurred",
        });
      } finally {
        setLoading(false);
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
    setNewBankAccount(Data?.bank_account || ""); // إعادة تعيين Bank Account عند الإلغاء
  };

  const handleSaveClick = async () => {
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("email", newEmail);
    formData.append("department", newDepartment);
    formData.append("bank_account", newBankAccount); // إضافة Bank Account إلى FormData
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      const response = await axios.post(UPDATE_PROFILE_ENDPOINT, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile updated successfully:", response.data);
      setData(response.data.profile);
      setIsEditing(false);

      const profileResponse = await axios.get(API_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (profileResponse.data && profileResponse.data.profile) {
        const profileData = profileResponse.data.profile;
        console.log(profileData);
        setData(profileData);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message || "Profile updated successfully!",
        });
      } else {
        throw new Error("Invalid profile data after update");
      }
    } catch (error) {
      console.error("Error updating profile:", error.response.data.message);
      setError(error.response?.data?.message || "An error occurred");
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "An error occurred!",
      });
    }
  };

  const handleImageChange = (event) => {
    setNewImage(event.target.files[0]);
  };

  const handleStartShift = async (shiftId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to start this shift?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, start it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/shifts/${shiftId}/start`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          console.log(`Shift ${shiftId} started successfully!`, response.data);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Shift started successfully!",
          });

          setShifts((prevShifts) =>
            prevShifts.map((shift) =>
              shift.id === shiftId ? { ...shift, status: "active" } : shift
            )
          );
        } catch (error) {
          console.error("Error starting shift:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error.response?.data?.message || "Failed to start the shift.",
          });
        }
      }
    });
  };

  const handleEndShift = async (shiftId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to end this shift?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, end it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/shifts/${shiftId}/end`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          console.log(`Shift ${shiftId} ended successfully!`, response.data);

          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Shift ended successfully!",
          });

          setShifts((prevShifts) =>
            prevShifts.map((shift) =>
              shift.id === shiftId ? { ...shift, status: "completed" } : shift
            )
          );
        } catch (error) {
          console.error("Error ending shift:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error.response?.data?.message || "Failed to end the shift.",
          });
        }
      }
    });
  };

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
      setError(error.response?.data?.message || "An error occurred");
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Error fetching shifts!",
      });
    }
  };

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
      hour = 12;
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
                    {/* إضافة حقل Bank Account */}
                    <div className="mb-3">
                      <label className="form-label">Bank Account:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newBankAccount}
                        onChange={(e) => setNewBankAccount(e.target.value)}
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
                    {/* إضافة عرض Bank Account */}
                    <p className="card-text">
                      <strong>Bank Account:</strong> {Data?.bank_account}
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
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shifts.map((shift) => (
                        <tr key={shift.id}>
                          <td>{shift.id}</td>
                          <td>{shift.employee_name}</td>
                          <td>{convertTo12Hour(shift.from)}</td>
                          <td>{shift.to}</td>
                          <td>{shift.day}</td>
                          <td>{shift.status}</td>
                          <td>
                            {/*  الزر يعرض بناءً على حالة الوردية */}
                            {shift.status === "active" ? (
                              // If shift is active, show only the "End" button
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleEndShift(shift.id)}
                              >
                                End
                              </button>
                            ) : shift.status === "completed" ? (
                              // If shift is completed, show the "Completed" message
                              <span>Shift Completed</span>
                            ) : (
                              // If shift is neither active nor completed, show both buttons
                              <>
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
                              </>
                            )}
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
