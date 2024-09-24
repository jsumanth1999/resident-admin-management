import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/userSlice.js";

const ResidentDashboard = () => {
  const [usersData, setUsersData] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [apartmentNo, setApartmentNo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [updateApartmentNo, setUpdateAparmentNo] = useState("");
  const [email, setEmail] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isProfileFormVisible, setIsProfileFormVisible] = useState(false);

  const dispatch = useDispatch();

  const showForm = () => {
    setIsFormVisible((isFormVisible) => !isFormVisible);
  };

  const showProfileForm = () => {
    setIsProfileFormVisible((prev) => !prev);
  };

  useEffect(() => {
    tableData();
  }, []);

  const token = localStorage.getItem("token");

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
      } else {
        const responseData = await response.json();
        alert(responseData.message);
      }
    } catch (error) {
      console.log("Network Error");
    }
  };

  const tableData = async () => {
    try {
      const createAPI = await fetch("http://localhost:8001/api/requests", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });
      const response = await createAPI.json();
      setUsersData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const createRequestHandler = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("apartmentNo", apartmentNo);
    files.forEach((file) => {
      formdata.append("images", file);
    });
    formdata.append("apartmentno", apartmentNo);

    setLoading(true);
    try {
      const createAPI = await fetch("http://localhost:8001/api/requests", {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formdata,
      });

      if (!createAPI.ok) {
        throw new Error(`HTTP error! status: ${createAPI.status}`);
      }

      const response = await createAPI.json();
      console.log(response);
      resetForm();
      tableData();
    } catch (error) {
      console.error("Error creating request:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = async (id) => {
    try {
      const response = await fetch(`http://localhost:8001/api/requests/${id}`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });
      const responseData = await response.json();
      const { data } = responseData;
      setApartmentNo(data.apartmentNo);
    } catch (error) {
      console.log("Network error");
    }
  };

  const getUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:8001/users/me", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });
      const responseData = await response.json();
      console.log(responseData);

      const { data } = responseData;
      console.log(data);
      setUpdateAparmentNo(data.apartmentNo);
      setEmail(data.email);
      setName(data.name);
    } catch (error) {
      console.log("Network error");
    }
  };

  const deleteRequestHandler = async (id) => {
    try {
      const response = await fetch(`http://localhost:8001/api/requests/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });
      const message = prompt("Confirm Wants to delete, Please text as 'DELETE'");
      if(message === "DELETE"){
        if (response.ok) {
          const responseData = await response.json();
          alert(responseData.message);
          tableData();
        } else {
          alert(response.message);
        }
     
      }
        
    } catch (error) {}
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFiles("");
    setApartmentNo("");
  };

  const signOut = () => {
    localStorage.removeItem("token");
    dispatch(logout({ isLoggedIn: false, role: null }));
    navigate("/login");
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
      <div className="text-3xl font-semibold text-black m-4 text-center flex flex-row justify-between">
        <h2>Resident Dashboard</h2>
        <div>
          <button
            className="text-xl text-white bg-blue-500 hover:bg-blue-400 p-2 mx-2"
            onClick={() => {
              getUserProfile();
              showProfileForm();
            }}
          >
            Update Profile
          </button>
          <button
            className="text-xl text-white bg-green-600 hover:bg-green-400 p-2 mx-2"
            onClick={showForm}
            disabled={loading}
          >
            Add Request
          </button>
          <button
            className="text-xl text-white bg-red-600 hover:bg-red-400 p-2"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div
        className="flex items-center justify-center min-h-screen bg-gray-100"
        style={{ display: isFormVisible ? "flex" : "none" }}
      >
        <div className="w-full max-w-xs">
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={createRequestHandler}
          >
            <h2 className="text-center text-2xl font-bold mb-6">
              Resident Request Form
            </h2>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
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
                placeholder="Enter your Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Images
              </label>
              <input
                type="file"
                name="images"
                id="images"
                multiple
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleFileChange}
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
                value={apartmentNo}
                onChange={(e) => setApartmentNo(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center flex-col">
              <button
                type="submit"
                className="w-full bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Request"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {isProfileFormVisible&&<div
        className="flex items-center justify-center min-h-screen bg-gray-100"
      >
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
                placeholder="Enter your Title"
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
                placeholder="Enter your Description"
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
                onChange={(e) => setUpdateAparmentNo(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center flex-col">
              <button
                type="submit"
                className="w-full bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
                onClick={updateProfileHandler}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>}

      <div className="max-w-full table-fixed">
        <table className="w-full table-auto border border-black">
          <thead className="border border-black">
            <tr>
              <th className="min-w-[120px] py-4 px-4 text-xl font-medium text-black xl:pl-11">
                Image
              </th>
              <th className="min-w-[220px] py-4 px-4 text-xl font-medium text-black xl:pl-11">
                Title
              </th>
              <th className="min-w-[220px] py-4 px-4 text-xl font-medium text-black xl:pl-11">
                Description
              </th>
              <th className="min-w-[120px] py-4 px-4 text-xl font-medium text-black xl:pl-11">
                Status
              </th>
              <th className="min-w-[120px] py-4 px-4 text-xl font-medium text-black xl:pl-11">
                Apartment No
              </th>
              <th className="min-w-[220px] py-4 px-4 text-xl font-medium text-black xl:pl-11">
                CreatedAt
              </th>
              <th className="min-w-[220px] py-4 px-4 text-xl font-medium text-black xl:pl-11">
                UpdatedAt
              </th>
              <th className="min-w-[220px] py-4 px-4 text-xl font-medium text-black xl:pl-11">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((data, index) => (
              <tr key={index}>
                <td className="border-b border-black py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
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
                  {data.apartmentNo}
                </td>
                <td className="border-b text-center border-black py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  {data.createdAt}
                </td>
                <td className="border-b text-center border-black py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  {data.updatedAt}
                </td>
                <td className="border-b text-center border-black py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  {/* <button className="bg-blue-500 hover:bg-blue-300 m-1 p-1"
                  onClick={updateForm(`${data._id}`)}>
                    Update
                  </button> */}
                  <button
                    className="bg-red-500 text-white hover:bg-red-300 m-1 px-2 p-1"
                    onClick={() => deleteRequestHandler(`${data._id}`)}
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

export default ResidentDashboard;
