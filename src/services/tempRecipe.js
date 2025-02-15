import axiosInstance from "@/utils/axiosInstance";

export const saveTempRecipe = async (payload) => {
  try {
    const response = await axiosInstance.post(`/api/tempRecipe`, payload);
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const getTempRecipeById = async (tempRecipeId) => {
  try {
    let response;
    response = await axiosInstance.get(`/api/tempRecipe/${tempRecipeId}`);
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const updateTempRecipe = async (tempRecipe) => {
  console.log({ tempRecipe });
  try {
    const response = await axiosInstance.put(
      `/api/tempRecipe/${tempRecipe._id}`,
      tempRecipe
    );
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};
