import axios from "../api/axiosInstance";
import { useState } from "react";
import useAuthStore from "../stores/authStore";
import useErrorStore from "../stores/errorStore";
import { Link, useNavigate } from "react-router";
import { loginSchema } from "../validations/authSchema";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const setUser = useAuthStore((state) => state.setUser);
  const setError = useErrorStore((state) => state.setError);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = loginSchema.safeParse(formData);
      if (!result.success) {
        const errors = {};
        result.error.issues.forEach((err) => {
          errors[err.path[0]] = err.message;
        });

        setValidationErrors(errors);
        return;
      }

      const res = await axios.post("/login.php", formData);
      setUser(res.data.data);
      navigate("/");
    } catch (err) {
      setError("Login: " + err.response?.data?.error, err.response?.status);
      navigate("/error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {validationErrors.email && (
              <p className="flex items-center text-sm text-red-500 mt-1">
                <ErrorOutlineIcon className="mr-1 text-base" />
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {validationErrors.password && (
              <p className="flex items-center text-sm text-red-500 mt-1">
                <ErrorOutlineIcon className="mr-1 text-base" />
                {validationErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-600 space-y-1">
          <p>
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
          <p>
            <Link to="/" className="text-blue-600 hover:underline">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
