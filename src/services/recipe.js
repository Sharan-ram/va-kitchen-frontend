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
    let response;
    let url = searchText
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/recipe?search=${searchText}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/recipe`;
    response = await axiosInstance.get(url);
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};
