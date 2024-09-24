import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../utils/userSlice.js'; 
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userItems = useSelector((store) => store.user);  
  console.log(userItems);
  
  const formdata = {
    email,
    password,
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      if (response.ok) {
        const responseData = await response.json();
        const { token, user } = responseData;

        dispatch(login({isLoggedIn: true,role: user.role }));

        localStorage.setItem("token", token);
        if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/resident-dashboard");
        }
      } else {
        const responseData = await response.json();
        alert(responseData.message);
      }
    } catch (error) {
      setError("Network error");
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={loginHandler}
        >
          <h2 className="text-center text-2xl font-bold mb-6">Login</h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter you Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center flex-col">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold m-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
            <button
              type="reset"
              className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={resetForm}
            >
              Reset
            </button>
          </div>
          <p className="m-2">
            Not Registered?{" "}
            <Link to="/register" className="text-blue-500">
              Register Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
