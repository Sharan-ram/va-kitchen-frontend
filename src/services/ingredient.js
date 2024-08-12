import axiosInstance from "@/utils/axiosInstance";

export const saveIngredient = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingredient`,
      payload
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const searchIngredient = async (searchText) => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingredient?search=${searchText}`
    );
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const getIngredientPrices = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingredient/price-summary`
    );
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const updatePrices = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingredient/update-price`,
      payload
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const getIngredientStock = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingredient/stock-summary`
    );
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const updateStock = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingredient/update-stock`,
      payload
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};
