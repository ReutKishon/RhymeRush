import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/useStore";
import { api } from "../../services";
import useAppStore from "../../store/useStore";
import { jwtDecode } from "jwt-decode";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("test1234");
  const [error, setError] = useState<string | null>(null);

  const setUser = useAppStore((state) => state.setUser);
  const navigate = useNavigate();


  if (localStorage.getItem("authToken")) {
    setUser(jwtDecode(localStorage.getItem("authToken") as string));
    navigate('/home')
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("please provide email and password!");
      return;
    }
    try {
      const loggedUser = await api.login(email, password);
      console.log(loggedUser);
      setUser(loggedUser);

      navigate("/home");
    } catch (err: any) {
      setError(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="2xl font-bold text-center gray-800 mb-6">
          Sign In
        </h2>
        {error && <p className="red-500 mb-4">{error}</p>}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
