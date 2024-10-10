import dbConnect from "../../../../lib/dbConnect";
import Recipe from "../../../../models/Recipe";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      // Get recipes based on search or return all
      try {
        const searchText = req.query.search || "";
        const query = searchText
          ? { name: { $regex: new RegExp(searchText, "i") } }
          : {};
        const recipes = await Recipe.find(query)
          .select(
            "_id dietType label mealType name tableSetting usualMealTime ingredients"
          )
          .sort({ name: 1 })
          .lean();

        const filteredRecipes = recipes.map((recipe) => {
          if (recipe.ingredients) {
            recipe.ingredients = recipe.ingredients.map((ingredient) => ({
              _id: ingredient._id,
              name: ingredient.ingredient.name,
              summerQuantity: ingredient.summerQuantity,
              winterQuantity: ingredient.winterQuantity,
              monsoonQuantity: ingredient.monsoonQuantity,
              retreatQuantity: ingredient.retreatQuantity,
            }));
          }
          return recipe;
        });

        res.status(200).json({ success: true, data: filteredRecipes });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case "POST":
      // Create a new recipe
      try {
        const recipe = await Recipe.create(req.body);
        res.status(201).json({ success: true, data: recipe });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
