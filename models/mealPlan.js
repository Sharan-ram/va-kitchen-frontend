import mongoose from "mongoose";

const CuttingSchema = mongoose.Schema({
  method: String,
  notes: String,
});

const LabelSchema = mongoose.Schema({
  indian: String,
  english: String,
});

const TableSettingSchema = mongoose.Schema({
  vessels: String,
  utensils: String,
});

const AllergySchema = mongoose.Schema({
  nuts: { type: Boolean, default: false },
  dairy: { type: Boolean, default: false },
  gluten: { type: Boolean, default: false },
  specificAllergyIngredient: String,
  allergyCode: { type: Number, default: 0 },
});

const FullIngredientSchema = mongoose.Schema({
  ingredient: {
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
  },
  summerQuantity: { type: Number, default: null },
  monsoonQuantity: { type: Number, default: null },
  winterQuantity: { type: Number, default: null },
  retreatQuantity: { type: Number, default: null },
  cutting: CuttingSchema,
  label: LabelSchema,
  tableSetting: TableSettingSchema,
  allergy: AllergySchema,
});

const RecipeSchema = mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [FullIngredientSchema],
  usualMealTime: String,
  mealType: String,
  dietType: {
    type: [String],
    enum: ["vegan", "nonVegan", "glutenFree"],
    default: ["nonVegan"],
  },
  allergyCode: { type: Number, default: 0 },
  adjustedAllergyCode: { type: Number, default: 0 },
  mainAllergiesMeal: String,
  specificAllergyMeal: String,
  combinedAllergyMeal: String,
});

const CommentSchema = mongoose.Schema({
  username: { type: String, required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const MealSchema = mongoose.Schema({
  mealCounts: {
    nonVeganCount: { type: Number, default: 0 },
    veganCount: { type: Number, default: 0 },
    glutenFreeCount: { type: Number, default: 0 },
  },
  recipes: [RecipeSchema],
  comments: [CommentSchema],
});

const DaySchema = mongoose.Schema({
  date: { type: String, required: true },
  season: { type: String, required: true },
  earlyMorning: { type: MealSchema, default: undefined },
  breakfast: { type: MealSchema, default: undefined },
  lunch: { type: MealSchema, default: undefined },
  evening: { type: MealSchema, default: undefined },
  dinner: { type: MealSchema, default: undefined },
});

const MealPlanSchema = mongoose.Schema({
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  season: { type: String, required: true },
  entireMonthCounts: {
    nonVeganCount: { type: Number, default: 0 },
    veganCount: { type: Number, default: 0 },
    glutenFreeCount: { type: Number, default: 0 },
  },
  days: [DaySchema],
});

export default mongoose.models.MealPlan ||
  mongoose.model("MealPlan", MealPlanSchema);
