import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";

export const login = async (payload) => {
  try {
    const response = await axios.post(`/api/user/login`, payload);
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const registerNewUser = async (payload) => {
  try {
    const response = await axiosInstance.post(`/api/user/register`, payload);
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
      `/api/user/reset-password/${token}`,
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

export const resetPasswordLoggedIn = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `/api/user/change-password`,
      payload
    );
    // console.log({ response });
    return response;
  } catch (e) {
    throw new Error(e);
  }
};
