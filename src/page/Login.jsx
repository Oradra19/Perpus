import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoUMS from "../assets/logoums.png";
import Logo from "../assets/logo.png";
import GambarLogin from "../assets/login.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); 

    try {
      const response = await axios.post(
        "https://perpus-be.vercel.app/api/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/admin");
    } catch (err) {
      setError("Login gagal. Periksa username dan password Anda.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center px-8">
        <div className="max-w-md w-full">
          <img src={LogoUMS} alt="UMS Logo" className="h-16 mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Selamat datang di UMS Library
          </h1>
          <p className="text-gray-600 mb-6">
            Lost Item Management System Universitas Muhammadiyah Surakarta
          </p>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Masukkan Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center justify-center bg-yellow-400 text-white px-6 py-2 rounded-lg shadow-md transition ml-auto
      ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-500"}`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>
        <p className="text-gray-500 text-sm mt-8">Copyright © UMS Library</p>
      </div>

      <div className="hidden md:flex w-1/2 bg-blue-900 relative">
        <img
          src={Logo}
          alt="UMS Logo"
          className="h-20 mb-6 absolute top-48 left-72"
        />
        <img
          src={GambarLogin}
          alt="Library"
          className="w-120 h-120 object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
