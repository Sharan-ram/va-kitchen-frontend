import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";

export const saveRecipe = async (payload) => {
  try {
    const response = await axiosInstance.post(`/api/recipe`, payload);
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const searchRecipe = async (searchText) => {
  try {
    let response;
    let url;
    // Client-side: Use relative URL
    url = searchText ? `/api/recipe?search=${searchText}` : `/api/recipe`;
    response = await axios.get(url);
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const getRecipeById = async (recipeId) => {
  try {
    let response;
    response = await axiosInstance.get(`/api/recipe/${recipeId}`);
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const updateRecipe = async (recipe) => {
  try {
    const response = await axiosInstance.put(
      `/api/recipe/${recipe._id}`,
      recipe
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const getRecipesDietType = async () => {
  try {
    const response = await axiosInstance.get(`/api/recipe/diet-type`);
    return response.data.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const updateRecipesDietType = async (payload) => {
  try {
    const response = await axiosInstance.post(`/api/recipe/diet-type`, payload);
    return response;
  } catch (e) {
    throw new Error(e);
  }
};
