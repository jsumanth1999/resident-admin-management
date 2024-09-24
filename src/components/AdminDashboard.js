import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/userSlice.js";
import { useDispatch } from "react-redux";

const AdminDashboard = () => {
  const [usersData, setUsersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [description, setDescription] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [updateApartmentNo, setUpdateApartmentNo] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isProfileFormVisible, setIsProfileFormVisible] = useState(false); // Added state for profile form visibility
  const [selectedStatus, setSelectedStatus] = useState("all");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const showForm = () => {
    setIsFormVisible((prev) => !prev);
  };

  const showProfileForm = () => {
    // Function to toggle profile form visibility
    setIsProfileFormVisible((prev) => !prev);
  };

  useEffect(() => {
    tableData();
  }, []);

  useEffect(() => {
    handleSearch(selectedStatus);
  }, [usersData, selectedStatus]);

  const token = localStorage.getItem("token");

  // Fetching requests data
  const tableData = async () => {
    try {
      const createAPI = await fetch("http://localhost:8001/api/requests", {
        method: "GET",
        headers: { Authorization: token },
      });
      const response = await createAPI.json();
      const { data } = response;
      if (Array.isArray(data)) {
        setUsersData(data);
        setFilteredData(data);
      } else {
        console.error("Data is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (status) => {
    if (status === "all") {
      setFilteredData(usersData);
    } else {
      const filteredDat = usersData.filter((data) => data.status === status);
      setFilteredData(filteredDat);
    }
  };

  const updateProfileHandler = async () => {
    const updatedData = {
      name,
      email,
      apartmentNo: updateApartmentNo,
    };
    try {
      const response = await fetch("http://localhost:8001/users/me", {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert(responseData.message);
        tableData();
        showProfileForm(); // Hide the profile form after update
      } else {
        const responseData = await response.json();
        alert(responseData.message);
      }
    } catch (error) {
      console.log("Network Error");
    }
  };

  const getUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:8001/users/me", {
        method: "GET",
        headers: { Authorization: token },
      });
      const responseData = await response.json();
      const { data } = responseData;
      setUpdateApartmentNo(data.apartmentNo);
      setEmail(data.email);
      setName(data.name);
    } catch (error) {
      console.log("Network error");
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    dispatch(logout({ isLoggedIn: false, role: null }));
    navigate("/login");
  };

  const deleteRequestHandler = async (id) => {
    try {
      const response = await fetch(`http://localhost:8001/api/requests/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      const message = prompt("Confirm Wants to delete, Please text as 'DELETE'");
      if (message === "DELETE") {
        if (response.ok) {
          const responseData = await response.json();
          alert(responseData.message);
          tableData();
        } else {
          alert(response.message);
        }
      }
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const updateForm = async (id) => {
    try {
      showForm();
      const response = await fetch(`http://localhost:8001/api/requests/${id}`, {
        method: "GET",
        headers: { Authorization: token },
      });
      const responseData = await response.json();
      const { data } = responseData;
      setUserId(data._id);
      setUpdatedStatus(data.status);
      setDescription(data.description);
    } catch (error) {
      console.log("Network error");
    }
  };

  const updateHandler = async (id) => {
    const updatedData = {
      status: updatedStatus,
      description,
    };
    try {
      const response = await fetch(`http://localhost:8001/api/requests/${id}`, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert(responseData.message);
        tableData();
        showForm();
      } else {
        const responseData = await response.json();
        alert(responseData.message);
        navigate("/resident-dashboard");
      }
    } catch (error) {
      console.log("Network Error");
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
      <div className="text-3xl font-semibold text-black m-4 text-center flex flex-row justify-between">
        <h2>Admin Dashboard</h2>
        <div className="flex flex-row">
          <button
            className="text-xl text-white bg-blue-500 hover:bg-blue-400 p-2 mx-2"
            onClick={() => {
              getUserProfile();
              showProfileForm(); // Show the profile form when button is clicked
            }}
          >
            Update Profile
          </button>
          <button
            className="text-xl text-white bg-red-600 hover:bg-red-400 p-2"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="m-4">
        <label htmlFor="status-filter" className="mr-2">
          Filter by Status:
        </label>
        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border p-1"
        >
          <option value="all">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {isFormVisible && (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="w-full max-w-xs">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-center text-2xl font-bold mb-6">
                Resident Update Form
              </h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="status"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                  className="border p-1 w-full"
                >
                  <option value="" disabled>
                    Select a status
                  </option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center flex-col">
                <button
                  type="submit"
                  className="w-full bg-green-500 m-2 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={(e) => {
                    e.preventDefault();
                    updateHandler(userId);
                  }}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isProfileFormVisible && ( // Conditionally render the profile form
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="w-full max-w-xs">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-center text-2xl font-bold mb-6">
                Update Profile Form
              </h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="apartmentno"
                >
                  Apartment No
                </label>
                <input
                  type="text"
                  name="apartmentno"
                  id="apartmentno"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your Apartment Number"
                  value={updateApartmentNo}
                  onChange={(e) => setUpdateApartmentNo(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center flex-col">
                <button
                  type="submit"
                  className="w-full bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={(e) => {
                    e.preventDefault();
                    updateProfileHandler();
                  }}
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={showProfileForm} // Add an onClick to toggle the form
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-full table-fixed">
        <table className="w-full table-auto border border-black">
          <thead className="border border-black">
            <tr>
              <th className="min-w-[120px] py-4 px-4 text-xl font-medium text-black xl:pl-11">
                Image
              </th>
              <th className="min-w-[120px] py-4 px-4 text-xl font-medium text-black xl:pl-11">
                Title
              </th>
              <th className="min-w-[220px] py-4 px-4 text-xl font-medium text-black xl:pl-11">
                Description
              </th>
              <th className="min-w-[120px] py-4 px-4 text-xl font-medium text-black xl:pl-11">
                Status
              </th>
              <th className="min-w-[120px] py-4 px-4 text-xl font-medium text-black xl:pl-11">
                CreatedAt
              </th>
              <th className="min-w-[220px] py-4 px-4 text-xl font-medium text-black xl:pl-11">
                UpdatedAt
              </th>
              <th className="min-w-[120px] py-4 px-4 text-xl font-medium text-black xl:pl-11">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((data, index) => (
              <tr key={index}>
                <td className="border-b text-center border-black py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <div className="flex">
                    {data.images.map((image, imgIndex) => (
                      // eslint-disable-next-line jsx-a11y/img-redundant-alt
                      <img
                        key={imgIndex}
                        src={`http://localhost:8001/${image}`}
                        alt={`Image ${imgIndex + 1}`}
                        width={50}
                        className="rounded mr-2"
                      />
                    ))}
                  </div>
                </td>
                <td className="border-b text-center border-black py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  {data.title}
                </td>
                <td className="border-b text-center border-black py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  {data.description}
                </td>
                <td className="border-b text-center border-black py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  {data.status}
                </td>
                <td className="border-b text-center border-black py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  {data.createdAt}
                </td>
                <td className="border-b text-center border-black py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  {data.updatedAt}
                </td>
                <td className="border-b text-center border-black py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <button
                    className="bg-blue-500 hover:bg-blue-300 m-1 p-1"
                    onClick={() => updateForm(data._id)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-300 m-1 p-1"
                    onClick={() => deleteRequestHandler(data._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
