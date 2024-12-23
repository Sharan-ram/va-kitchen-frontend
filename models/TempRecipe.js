import mongoose from "mongoose";
import Ingredient from "./Ingredient.js";

const FullIngredientSchema = mongoose.Schema({
  ingredient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ingredient",
    required: true,
  },
  summerQuantity: {
    type: Number,
  },
  monsoonQuantity: {
    type: Number,
  },
  winterQuantity: {
    type: Number,
  },
  retreatQuantity: {
    type: Number,
  },
});

const TempRecipeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  originalRecipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  ingredients: [FullIngredientSchema],
  dietType: {
    type: [String], // Diet type is now an array
    enum: ["vegan", "nonVegan", "glutenFree"],
    default: ["nonVegan"],
    required: true,
  },
});

export default mongoose.models.TempRecipe ||
  mongoose.model("TempRecipe", TempRecipeSchema);
