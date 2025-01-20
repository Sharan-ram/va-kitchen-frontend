// export const MONTHS = [
//   { text: "January", value: "01" },
//   { text: "February", value: "02" },
//   { text: "March", value: "03" },
//   { text: "April", value: "04" },
//   { text: "May", value: "05" },
//   { text: "June", value: "06" },
//   { text: "July", value: "07" },
//   { text: "August", value: "08" },
//   { text: "September", value: "09" },
//   { text: "October", value: "10" },
//   { text: "November", value: "11" },
//   { text: "December", value: "12" },
// ];

export const purchaseUnits = [
  { text: "KG", value: "kg" },
  { text: "L", value: "l" },
  { text: "B", value: "b" },
  { text: "Nos", value: "nos" },
  { text: "BTLS", value: "btls" },
  { text: "Packs", value: "packs" },
  { text: "Tins", value: "tins" },
];

export const ingredientType = [
  { text: "Spices", value: "Spices" },
  { text: "Cereals", value: "Cereals" },
  { text: "Provisions", value: "Provisions" },
  { text: "Special Provisions", value: "Special Provisions" },
  { text: "Veg", value: "Veg" },
  { text: "Fruit", value: "Fruit" },
  { text: "Pulses", value: "Pulses" },
  { text: "Herbs", value: "Herbs" },
  { text: "Masalas", value: "Masalas" },
  { text: "Vegan Milk", value: "Vegan Milk" },
  { text: "Non Dairy", value: "Non Dairy" },
  { text: "Dairy", value: "Dairy" },
  { text: "Preserve", value: "Preserve" },
  { text: "Seasoning/Sweetening", value: "Seasoning/Sweetening" },
  { text: "Seeds", value: "Seeds" },
];

export const storageType = [
  { text: "Special Provisions", value: "Special Provisions" },
  { text: "Provisions", value: "Provisions" },
  { text: "Veg & Fruit", value: "Veg & Fruit" },
  { text: "Milk", value: "Milk" },
  { text: "Bulk Provisions", value: "Bulk Provisions" },
  { text: "Vegan Milk", value: "Vegan Milk" },
];

export const vendors = [
  { text: "V.K. Stores", value: "V.K. Stores" },
  { text: "Jainam", value: "Jainam" },
  { text: "Locally", value: "Locally" },
  { text: "V.K. Stores / Locally", value: "V.K. Stores / Locally" },
  { text: "Jainam / Online", value: "Jainam / Online" },
  { text: "Jainam / Locally", value: "Jainam / Locally" },
  { text: "Online", value: "Online Shopping" },
  { text: "K.V.M", value: "K.V.M" },
  { text: "K.V.M / Locally", value: "K.V.M / Locally" },
  { text: "Weikfield", value: "Weikfield" },
  { text: "Two brothers", value: "Two brothers" },
  { text: "Nutririte", value: "Nutririte" },
  { text: "One Good (Goodmylk)", value: "One Good (Goodmylk)" },
  { text: "Soft Spot", value: "Soft Spot" },
  { text: "Mansookhlal", value: "Mansookhlal" },
  { text: "SAP Agrotech Pvt Ltd", value: "SAP Agrotech Pvt Ltd" },
  { text: "Vedanta Academy", value: "Vedanta Academy" },
  { text: "Mill House", value: "Mill House" },
  { text: "Keitan", value: "Keitan" },
  { text: "Chetran", value: "Chetran" },
  { text: "MTR", value: "MTR" },
];

export const years = Array.from({ length: 7 }, (_, i) => ({
  text: `${2024 + i}`,
  value: `${2024 + i}`,
}));

export const months = [
  { text: "January", value: 1 },
  { text: "February", value: 2 },
  { text: "March", value: 3 },
  { text: "April", value: 4 },
  { text: "May", value: 5 },
  { text: "June", value: 6 },
  { text: "July", value: 7 },
  { text: "August", value: 8 },
  { text: "September", value: 9 },
  { text: "October", value: 10 },
  { text: "November", value: 11 },
  { text: "December", value: 12 },
];

export const seasons = [
  { text: "Summer", value: "summerQuantity" },
  { text: "Monsoon", value: "monsoonQuantity" },
  { text: "Winter", value: "winterQuantity" },
  { text: "Retreat", value: "retreatQuantity" },
];

export const meals = [
  "earlyMorning",
  "breakfast",
  "lunch",
  "evening",
  "dinner",
];

export const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const dietTypeCounts = [
  "veganCount",
  "nonVeganCount",
  "glutenFreeCount",
];

export const dietTypeTextMap = {
  veganCount: "Vegan Count",
  nonVeganCount: "Non Vegan Count",
  glutenFreeCount: "Gluten Free Count",
};

export const usualMealTime = [
  { text: "BF", value: "BF" },
  { text: "L", value: "L" },
  { text: "D", value: "D" },
  { text: "BF, D", value: "BF, D" },
  { text: "BF, L", value: "BF, L" },
  { text: "L, D", value: "L, D" },
];

export const mealType = [
  { text: "Meal", value: "Meal" },
  { text: "Rice", value: "Rice" },
  { text: "Dessert", value: "Dessert" },
  { text: "Bread / Roti", value: "Bread / Roti" },
  { text: "Salad", value: "Salad" },
  { text: "Salad Dressing", value: "Salad Dressing" },
  { text: "Side", value: "Side" },
  { text: "Sauce", value: "Sauce" },
  { text: "Pasta", value: "Pasta" },
  { text: "Fruit", value: "Fruit" },
  { text: "Drink", value: "Drink" },
  { text: "Soup", value: "Soup" },
  { text: "Spread", value: "Spread" },
  { text: "Vegetable", value: "Vegetable" },
  { text: "Curry", value: "Curry" },
  { text: "Chutney", value: "Chutney" },
  { text: "Dal", value: "Dal" },
  { text: "Sprouts", value: "Sprouts" },
  { text: "Pickle", value: "Pickle" },
];

export const dietType = [
  { value: "vegan", text: "Vegan" },
  { value: "nonVegan", text: "Non-Vegan" },
  { value: "glutenFree", text: "Gluten-Free" },
];
