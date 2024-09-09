import axiosInstance from "@/utils/axiosInstance";

export const scheduleMail = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/email-scheduler`,
      payload
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};
