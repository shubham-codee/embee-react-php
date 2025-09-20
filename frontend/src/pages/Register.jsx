import axios from "../api/axiosInstance";
import { useState } from "react";
import useAuthStore from "../stores/authStore";
import useErrorStore from "../stores/errorStore";
import { Link, useNavigate } from "react-router";
import { registerSchema } from "../validations/authSchema";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const setError = useErrorStore((state) => state.setError);
  const setUser = useAuthStore((state) => state.setUser);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = registerSchema.safeParse(formData);
      if (!result.success) {
        const errors = {};
        result.error.issues.forEach((err) => {
          errors[err.path[0]] = err.message;
        });

        setValidationErrors(errors);
        return;
      }

      const res = await axios.post("/register.php", formData);
      setUser(res.data.data);
      navigate("/");
    } catch (err) {
      setError("Register: " + err.response?.data?.error, err.response?.status);
      navigate("/error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 md:p-8 transition-all">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:ring-2 ">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full py-2 outline-none"
              />
            </div>
            {validationErrors.username && (
              <p className="flex items-center text-sm text-red-500 mt-1">
                <ErrorOutlineIcon className="mr-1 text-base" />
                {validationErrors.username}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:ring-2 ">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-2 outline-none"
              />
            </div>
            {validationErrors.email && (
              <p className="flex items-center text-sm text-red-500 mt-1">
                <ErrorOutlineIcon className="mr-1 text-base" />
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:ring-2 ">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full py-2 outline-none"
              />
            </div>
            {validationErrors.password && (
              <p className="flex items-center text-sm text-red-500 mt-1">
                <ErrorOutlineIcon className="mr-1 text-base" />
                {validationErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-[1.02] cursor-pointer"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-600 space-y-1">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Login
            </Link>
          </p>
          <p>
            <Link
              to="/"
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
