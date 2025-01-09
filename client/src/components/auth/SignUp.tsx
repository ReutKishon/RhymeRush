import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAppStore from "../../store/useStore";
import { jwtDecode } from "jwt-decode";
import CustomInput from "../common/CustomInput";
import { validations } from '../../utils/validations';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [error, setError] = useState<string | null>(null);

  const setUser = useAppStore((state) => state.setUser);
  // const setUsernameGlobal = useUserStore((state) => state.setUsername);

  const navigate = useNavigate();
  if (localStorage.getItem("authToken")) {
    setUser(jwtDecode(localStorage.getItem("authToken") as string));
    navigate('/home')
  }
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/signup",
        {
          username: username,
          email: email,
          password: password,
          passwordConfirm: passwordConfirm,
        }
      );
      console.log(response);
      setUser(response.data.user);
      // setUserIdGlobal(response.data.data.user._id);

      navigate("/home");
    } catch (err: any) {
      // console.log(err);
      setError(err.response.data.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSignUp}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="2xl font-bold text-center mb-6">Sign Up</h2>

        {error && <p className="red-500 sm mb-4">{error}</p>}

        <div className="mb-4">
          <CustomInput
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            label="Username"
            validations={[
              validations.required,
              validations.minLength(3),
              validations.maxLength(20)
            ]}
          />
        </div>

        <div className="mb-4">
          <CustomInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            label="Email"
            validations={[
              validations.required,
              validations.email
            ]}
          />
        </div>

        <div className="mb-6">
          <CustomInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            label="Password"
            validations={[
              validations.required,
              validations.minLength(8)
            ]}
          />
        </div>
        <div className="mb-6">
          <CustomInput
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Confirm your password"
            label="Password Confirm"
            validations={[
              validations.required,
              validations.matchesPassword(password)
            ]}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 white font-medium py-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
