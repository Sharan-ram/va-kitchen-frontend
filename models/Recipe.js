import mongoose from "mongoose";

const CuttingSchema = mongoose.Schema({
  method: {
    type: String,
  },
  notes: {
    type: String,
  },
});

const LabelSchema = mongoose.Schema({
  indian: {
    type: String,
  },
  english: {
    type: String,
  },
});

const TableSettingSchema = mongoose.Schema({
  vessels: {
    type: String,
  },
  utensils: {
    type: String,
  },
});

const AllergySchema = mongoose.Schema({
  nuts: {
    type: Boolean,
    default: false,
  },
  dairy: {
    type: Boolean,
    default: false,
  },
  gluten: {
    type: Boolean,
    default: false,
  },
  specificAllergyIngredient: {
    type: String,
  },
  allergyCode: {
    type: Number,
    default: 0,
  },
  adjustedAllergyCode: {
    type: Number,
    default: 0,
  },
  mainAllergiesMeal: {
    type: String,
  },
  specificAllergyMeal: {
    type: String,
  },
  combinedAllergyMeal: {
    type: String,
  },
});

const FullIngredientSchema = mongoose.Schema({
  ingredient: {
    name: {
      type: String,
      required: true,
    },
    englishEquivalent: {
      type: String,
    },
    ingredientType: {
      type: String,
      required: true,
    },
    storageType: {
      type: String,
    },
    vendor: {
      type: String,
      required: true,
    },
    sponsored: {
      type: Boolean,
      default: false,
    },
    purchaseUnit: {
      type: String,
      required: true,
    },
    cookingUnit: {
      type: String,
      required: true,
    },
    purchaseUnitPerCookingUnit: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
    },
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
  cutting: CuttingSchema,
  allergy: AllergySchema,
});

const RecipeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: [FullIngredientSchema],
  usualMealTime: {
    type: String,
  },
  mealType: {
    type: String,
  },
  dietType: {
    type: [String], // Diet type is now an array
    enum: ["vegan", "nonVegan", "glutenFree"],
    default: ["nonVegan"],
    required: true,
  },
  label: LabelSchema,
  tableSetting: TableSettingSchema,
});

export default mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema);
