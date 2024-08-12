import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";

export const login = async (payload) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`,
      payload
    );
    return response.data.token;
  } catch (e) {
    throw new Error(e);
  }
};

export const registerNewUser = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/register`,
      payload
    );
    return response.data.message;
  } catch (e) {
    throw new Error(e);
  }
};

export const requestPasswordReset = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/request-password-reset`,
      payload
    );
    return response.data.message;
  } catch (e) {
    throw new Error(e);
  }
};

export const resetPassword = async ({ token, password }) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/reset-password/${token}`,
      { password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};
