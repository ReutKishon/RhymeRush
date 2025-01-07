import React from "react";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../store/useStore";
import { jwtDecode } from "jwt-decode";

const Welcome = () => {
  const navigate = useNavigate();

  const {setUser } = useAppStore()

  if (localStorage.getItem("authToken")) {
    setUser(jwtDecode(localStorage.getItem("authToken") as string));
    navigate('/home')
  }


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="3xl font-bold mb-8">Welcome!</h1>
      <div className="space-y-4">
        <button
          className="px-6 py-3 bg-blue-500 white rounded hover:bg-blue-600"
          onClick={() => navigate("/signin")}
        >
          Sign In
        </button>
        <button
          className="px-6 py-3 bg-green-500 white rounded hover:bg-green-600"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Welcome;
