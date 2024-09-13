import axiosInstance from "@/utils/axiosInstance";
import { format } from "date-fns";

export const getMealPlanPerMonth = async (year, month) => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/mealPlan?year=${year}&month=${month}`
    );
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const getMealPlanBetweenDateRange = async (startDate, endDate) => {
  try {
    const response = await axiosInstance.get(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/mealPlan/date-range?startDate=${format(
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
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/mealPlan`,
      payload
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const updateExistingMealPlan = async (mealPlan) => {
  try {
    const { __v, ...rest } = mealPlan;
    const response = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/mealPlan/${mealPlan._id}`,
      {
        ...rest,
      }
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const addComment = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/comment/add-comment`,
      payload
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteComment = async (payload) => {
  try {
    const response = await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/comment/delete-comment`,
      { data: payload }
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};
