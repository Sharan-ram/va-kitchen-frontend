import React, { useState } from "react";
import { registerNewUser } from "@/services/user";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import classNames from "classnames";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [createNewUserLoading, setCreateUserLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCreateUserLoading(true);
      await registerNewUser({
        username,
        email,
        password,
        role,
      });
      // setMessage(response);
      setCreateUserLoading(false);
      toast.success(`New ${role} registered ${username}!`);
    } catch (error) {
      // setMessage(error.response.data.message || "Error registering user");
      setCreateUserLoading(false);
      toast.error(`Error registering user!`);
    }
  };

  const isButtonDisabled =
    createNewUserLoading || !username || !role || !email || !password;

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your username"
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
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="role"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {/* {message && (
            <p className="text-red-500 text-xs italic mb-4">{message}</p>
          )} */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={classNames(
                "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
                isButtonDisabled && "cursor-not-allowed opacity-50"
              )}
              disabled={isButtonDisabled}
            >
              {createNewUserLoading ? <Loader /> : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
