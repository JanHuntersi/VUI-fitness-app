import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Registration() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password === formData.confirmPassword) {
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

      const newUser = {
        email: formData.email,
        password: formData.password,
      };

      existingUsers.push(newUser);

      localStorage.setItem("users", JSON.stringify(existingUsers));

      setRegistrationSuccessful(true);
    } else {
      setError("Passwords do not match. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">User Registration</h2>
        {registrationSuccessful ? (
          <div>
            <p>User successfully created!</p>
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="confirmPassword"
                  className="block font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              {error ? (
                <div className="text-red-500 my-1 h-5">{error}</div>
              ) : (
                <div className="h-5 my-1"></div>
              )}
              <button
                type="submit"
                className="w-full bg-red-500 text-white p-2 rounded hover-bg-red-600"
              >
                Register
              </button>
            </form>
            <p>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-500 cursor-pointer"
              >
                Go to login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Registration;
