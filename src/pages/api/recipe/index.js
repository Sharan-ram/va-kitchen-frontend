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
        if (searchText) {
          // If search text is present
          const query = {
            name: { $regex: new RegExp(searchText, "i") },
          };

          // Find recipes that match the search text and return the full object
          const recipes = await Recipe.find(query)
            .select("_id name")
            .sort({ name: 1 })
            .lean();

          res.status(200).json({ success: true, data: recipes }); // Send the full recipe object
        } else {
          // If search text is absent

          // Fetch all recipes but only select specific fields and filter ingredients
          const recipes = await Recipe.find({})
            .select(
              "_id dietType label mealType name tableSetting usualMealTime ingredients"
            )
            .sort({ name: 1 })
            .lean();

          // Filter and map ingredients to return only the required fields
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
        }
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
