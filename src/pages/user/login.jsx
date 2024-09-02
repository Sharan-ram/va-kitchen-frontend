import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { login } from "@/services/user";
import Link from "next/link";
import Loader from "@/components/Loader";
import classNames from "classnames";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userLoading, setUserLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (jwt) {
      router.push("/mealPlan/render");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUserLoading(true);
      const response = await login({ username, password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      window.dispatchEvent(new Event("userUpdated"));
      router.push("/mealPlan/render");
      setUserLoading(false);
    } catch (error) {
      setError("Invalid username or password");
      setUserLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
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
          <div className="mb-2">
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-2">
            <Link
              href="/user/request-password-reset"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Forgot Password?
            </Link>
          </div>

          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={classNames(
                "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
                userLoading && "cursor-not-allowed opacity-50"
              )}
              disabled={userLoading}
            >
              {userLoading ? <Loader /> : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
