import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response, // Simply return the response if it's successful
  (error) => {
    if (error.response && error.response.status === 401) {
      // console.log({ error });
      // If the error is unauthorized, remove the token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/user/login"; // Adjust the path to your login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
