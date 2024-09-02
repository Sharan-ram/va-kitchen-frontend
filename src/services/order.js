import axiosInstance from "@/utils/axiosInstance";
import format from "date-fns/format";

export const getMonthlyOrder = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/monthly-order`
    );
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const generateMonthlyPurchaseOrder = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/generate-monthly-purchase-order`,
      payload
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const generateWeeklyPurchaseOrder = async ({
  payload,
  startDate,
  endDate,
}) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/generate-weekly-purchase-order/${startDate}/${endDate}`,
      payload
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const getWeeklyOrder = async (startDate, endDate) => {
  try {
    const response = await axiosInstance.get(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/order/weekly-order?startDate=${format(
        startDate,
        "dd-MM-yyyy"
      )}&endDate=${format(endDate, "dd-MM-yyyy")}`
    );
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};
