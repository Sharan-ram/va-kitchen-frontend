import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  englishEquivalent: String,
  ingredientType: { type: String, required: true },
  storageType: String,
  vendor: { type: String, required: true },
  sponsored: { type: Boolean, default: false },
  purchaseUnit: { type: String, required: true },
  cookingUnit: { type: String, required: true },
  purchaseUnitPerCookingUnit: { type: Number, required: true },
  price: Number,
  stock: Number,
  bulkOrder: {
    summerQuantity: { type: Number, default: null },
    monsoonQuantity: { type: Number, default: null },
    winterQuantity: { type: Number, default: null },
    retreatQuantity: { type: Number, default: null },
  },
  nuts: { type: Boolean, default: false },
  dairy: { type: Boolean, default: false },
  gluten: { type: Boolean, default: false },
  ingredientSpecificAllergy: String,
  allergyCode: Number,
  masterCode: String,
  todo: String,
});

module.exports =
  mongoose.models.Ingredient || mongoose.model("Ingredient", IngredientSchema);
