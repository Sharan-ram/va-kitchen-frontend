import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";

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
    response = await axios.get(url);
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const getRecipeById = async (recipeId) => {
  try {
    let response;
    response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/recipe/${recipeId}`
    );
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const updateRecipe = async (recipe) => {
  try {
    const response = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/recipe/${recipe._id}`,
      recipe
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};
