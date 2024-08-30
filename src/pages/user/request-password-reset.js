import React, { useState } from "react";
import { requestPasswordReset } from "@/services/user";
import Loader from "@/components/Loader";
import classNames from "classnames";
import { toast } from "react-toastify";

const RequestPasswordReset = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  // const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await requestPasswordReset({
        username,
        email,
      });
      // setMessage(response);
      setLoading(false);
      toast.success("Password reset email sent!");
    } catch (error) {
      setLoading(false);
      toast.error("Error, try again later!");
    }
  };

  const isButtonDisabled = !username || !email || loading;

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Request Password Reset
        </h2>
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
          {/* {message && <p className="text-red-500 text-xs mb-4">{message}</p>} */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={classNames(
                "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
                isButtonDisabled && "cursor-not-allowed opacity-50"
              )}
              disabled={isButtonDisabled}
            >
              {loading ? <Loader /> : "Request Reset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestPasswordReset;
