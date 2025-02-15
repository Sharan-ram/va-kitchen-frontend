import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";

export const saveIngredient = async (payload) => {
  try {
    const response = await axiosInstance.post(`/api/ingredient`, payload);
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const searchIngredient = async (searchText) => {
  try {
    let url;

    // Check if running on the server (no window object) or client
    if (typeof window === "undefined") {
      // Server-side: Use absolute URL
      url = searchText
        ? `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/ingredient?search=${searchText}`
        : `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/ingredient`;
    } else {
      // Client-side: Use relative URL
      url = searchText
        ? `/api/ingredient?search=${searchText}`
        : `/api/ingredient`;
    }

    console.log({ url });

    // console.log({ url });
    const response = await axios.get(url);
    // console.log({ response });
    return response.data.data;
  } catch (e) {
    console.log("Axios Error:", e.response ? e.response.data : e.message); // Log the full error
    throw new Error(e);
  }
};

export const getIngredientById = async (ingredientId) => {
  try {
    let response;
    response = await axiosInstance.get(`/api/ingredient/${ingredientId}`);
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const updateIngredient = async (ingredient) => {
  try {
    const response = await axiosInstance.put(
      `/api/ingredient/${ingredient._id}`,
      ingredient
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const getIngredientPrices = async () => {
  try {
    const response = await axiosInstance.get(`/api/ingredient/price`);
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const updatePrices = async (payload) => {
  try {
    const response = await axiosInstance.post(`/api/ingredient/price`, payload);
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const getIngredientStock = async () => {
  try {
    const response = await axiosInstance.get(`/api/ingredient/stock`);
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const updateStock = async (payload) => {
  try {
    const response = await axiosInstance.post(`/api/ingredient/stock`, payload);
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const getIngredientBulkOrder = async () => {
  try {
    const response = await axiosInstance.get(`/api/ingredient/bulkOrder`);
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const updateBulkOrder = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `/api/ingredient/bulkOrder`,
      payload
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};
