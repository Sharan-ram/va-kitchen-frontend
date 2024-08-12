import axiosInstance from "@/utils/axiosInstance";

export const saveRecipe = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/recipe`,
      payload
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const searchRecipe = async (searchText) => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/recipe?search=${searchText}`
    );
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};
