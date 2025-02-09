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
  const [newBankAccount, setNewBankAccount] = useState("");
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = JSON.parse(localStorage.getItem("AuthToken"));

  const API_ENDPOINT = "https://test.ashlhal.com/api/profile";
  const UPDATE_PROFILE_ENDPOINT = "https://test.ashlhal.com/api/update-profile";
  const SHIFTS_ENDPOINT = "https://test.ashlhal.com/api/shifts";
  const START_SHIFT_ENDPOINT = "https://test.ashlhal.com/api/shifts";
  const END_SHIFT_ENDPOINT = "https://test.ashlhal.com/api/shifts";

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
          setNewBankAccount(profileData.bank_account || "");
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
    setNewBankAccount(Data?.bank_account || "");
    setNewImage(null);
  };

  const handleSaveClick = async () => {
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("email", newEmail);
    formData.append("department", newDepartment);
    formData.append("bank_account", newBankAccount);
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
    try {
      const response = await axios.post(
        `${START_SHIFT_ENDPOINT}/${shiftId}/start`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(`Shift ${shiftId} started!`, response.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Shift ${shiftId} started successfully!`,
      });
      fetchShifts(); // Refresh shifts after start
    } catch (error) {
      console.error("Error starting shift:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Failed to start shift",
      });
    }
  };

  const handleEndShift = async (shiftId) => {
    try {
      const response = await axios.post(
        `${END_SHIFT_ENDPOINT}/${shiftId}/end`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(`Shift ${shiftId} ended!`, response.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Shift ${shiftId} ended successfully!`,
      });
      fetchShifts(); // Refresh shifts after end
    } catch (error) {
      console.error("Error ending shift:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Failed to end shift",
      });
    }
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
                    {/* ... باقي فورم التعديل ... */}
                  </div>
                ) : (
                  // عرض معلومات الملف الشخصي
                  <div>
                    <h5 className="card-title">Profile Information</h5>
                    {/* ... باقي عرض معلومات الملف الشخصي ... */}
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
                          <td>{convertTo12Hour(shift.to)}</td>
                          <td>{shift.day}</td>
                          <td>{shift.status}</td>
                          <td>
                            {/* إخفاء الأزرار إذا كانت حالة الوردية "ended" */}
                            {shift.status !== "ended" ? (
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
                            ) : null}
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
