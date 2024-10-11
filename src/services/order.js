import axiosInstance from "@/utils/axiosInstance";
import format from "date-fns/format";

export const getMonthlyOrder = async () => {
  try {
    const response = await axiosInstance.get(`/api/order/monthly`);
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const generateGoogleSheet = async ({ payload, title }) => {
  try {
    const response = await axiosInstance.post(
      `/api/google/generate-googlesheet`,
      { data: payload, title }
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const getWeeklyOrder = async (startDate, endDate) => {
  try {
    const response = await axiosInstance.get(
      `/api/order/weekly?startDate=${format(
        startDate,
        "dd-MM-yyyy"
      )}&endDate=${format(endDate, "dd-MM-yyyy")}`
    );
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const getDailyOrder = async (startDate, endDate) => {
  try {
    const response = await axiosInstance.get(
      `/api/order/daily?startDate=${format(
        startDate,
        "dd-MM-yyyy"
      )}&endDate=${format(endDate, "dd-MM-yyyy")}`
    );
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};
