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
    let response;
    let url = searchText
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingredient?search=${searchText}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingredient`;
    response = await axiosInstance.get(url);
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const getIngredientById = async (ingredientId) => {
  try {
    let response;
    response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingredient/${ingredientId}`
    );
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const updateIngredient = async (ingredient) => {
  try {
    const response = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingredient/${ingredient._id}`,
      ingredient
    );
    return response;
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
