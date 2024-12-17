import axiosInstance from "@/utils/axiosInstance";
import { format } from "date-fns";
import pako from "pako";

export const getMealPlanPerMonth = async (year, month) => {
  try {
    const response = await axiosInstance.get(
      `/api/mealPlan?year=${year}&month=${month}`
    );
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const getMealPlanBetweenDateRange = async (startDate, endDate) => {
  try {
    const response = await axiosInstance.get(
      `/api/mealPlan/date-range?startDate=${format(
        startDate,
        "dd-MM-yyyy"
      )}&endDate=${format(endDate, "dd-MM-yyyy")}`
    );
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const saveNewMealPlan = async (payload) => {
  try {
    // const compressedPayload = pako.gzip(JSON.stringify(payload));
    console.log({ payload });
    const response = await axiosInstance.post(
      `/api/mealPlan`,
      payload
      // {
      //   headers: {
      //     "Content-Encoding": "gzip",
      //     "Content-Type": "application/json",
      //   },
      //   transformRequest: [(data) => data],
      // }
    );
    console.log({ response });
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const updateExistingMealPlan = async (mealPlan) => {
  try {
    const { __v, ...rest } = mealPlan;
    // const compressedPayload = pako.gzip(JSON.stringify({ ...rest }));
    const response = await axiosInstance.put(
      `/api/mealPlan/${mealPlan._id}`,
      { ...rest }
      // {
      //   headers: {
      //     "Content-Encoding": "gzip",
      //     "Content-Type": "/application/octet-stream",
      //   },
      //   transformRequest: [(data) => data],
      // }
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const addComment = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `/api/mealPlan/comments`,
      payload
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteComment = async (payload) => {
  try {
    const response = await axiosInstance.delete(`/api/mealPlan/comments`, {
      data: payload,
    });
    return response;
  } catch (e) {
    throw new Error(e);
  }
};
