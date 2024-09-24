import "./App.css";
import { Link } from "react-router-dom";

const App = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-black-600 mb-6">
        Welcome to the Maintenance Request System
      </h1>
      <div className="flex space-x-4">
        <Link to="/login">
          <button className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default App;
