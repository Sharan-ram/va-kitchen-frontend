import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { resetPassword, resetPasswordLoggedIn } from "@/services/user";

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isQueryReady, setIsQueryReady] = useState(false);

  useEffect(() => {
    // Mark query as ready when token is available or if we are sure the query parameters have been resolved
    if (token !== undefined || router.isReady) {
      setIsQueryReady(true);

      if (isLoggedIn()) {
        setIsUserLoggedIn(true);
      } else if (!token) {
        // Redirect to login or show an error if the user is not logged in and no token is provided
        setMessage("Invalid access. Please login to reset your password.");
        setTimeout(() => {
          router.push("/user/login");
        }, 3000);
      }
    }
  }, [token, router.isReady]);

  const isLoggedIn = () => {
    // Check if the user is logged in by verifying the presence of a valid JWT token or user session
    return !!localStorage.getItem("token");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      let response;
      if (token) {
        // Password reset via email link
        response = await resetPassword({ token, password });
      } else if (isUserLoggedIn) {
        // Password reset when the user is logged in, requiring current password
        response = await resetPasswordLoggedIn({
          currentPassword,
          newPassword: password,
        });
      }

      if (response.status === 200) {
        setMessage("Password reset successful: Redirecting to login page");
        setTimeout(() => {
          router.push("/user/login");
        }, 2000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  if (!isQueryReady) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-6 bg-white shadow-md rounded-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Password
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Only show the current password field if the user is logged in */}
            {isUserLoggedIn && (
              <div>
                <label htmlFor="current-password" className="sr-only">
                  Current Password
                </label>
                <input
                  id="current-password"
                  name="current-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${
                  isUserLoggedIn ? "" : "rounded-t-md"
                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {message && <div className="text-red-500 text-center">{message}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
