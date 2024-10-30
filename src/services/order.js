import axiosInstance from "@/utils/axiosInstance";
import format from "date-fns/format";

export const getMonthlyOrder = async ({ headCount, startDate, endDate }) => {
  try {
    const response = await axiosInstance.get(
      `/api/order/monthly?headCount=${headCount}&startDate=${format(
        startDate,
        "dd-MM-yyyy"
      )}&endDate=${format(endDate, "dd-MM-yyyy")}`
    );
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const generateGoogleSheet = async ({ payload, title }) => {
  try {
    const res = await axiosInstance.post(`/api/google/generate-googlesheet`, {
      data: payload,
      title,
      username: "user1",
    });
    if (res.data.authUrl) {
      // Redirect the user to the authorization URL
      window.open(res.data.authUrl, "_blank");
    } else if (res.data.url) {
      // Open the Google Sheet in a new tab
      window.open(res.data.url, "_blank");
    } else {
      throw new Error("No URL returned from the server.");
    }
    return res;
  } catch (e) {
    throw new Error(e);
  }
};

export const getWeeklyOrder = async ({
  startDate,
  endDate,
  startDateDeduction,
  endDateDeduction,
  season,
}) => {
  try {
    const response = await axiosInstance.get(
      `/api/order/weekly?startDate=${format(
        startDate,
        "dd-MM-yyyy"
      )}&endDate=${format(endDate, "dd-MM-yyyy")}&startDateDeduction=${format(
        startDateDeduction,
        "dd-MM-yyyy"
      )}&endDateDeduction=${format(
        endDateDeduction,
        "dd-MM-yyyy"
      )}&season=${season}`
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
