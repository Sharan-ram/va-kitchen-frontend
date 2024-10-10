import dbConnect from "../../../../lib/dbConnect";
import Recipe from "../../../../models/Recipe";
import authMiddleware from "../../../../middleware/auth";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      // Fetch diet types for all recipes
      try {
        const recipes = await Recipe.find({})
          .select("_id dietType name")
          .sort({ name: 1 })
          .lean();

        res.status(200).json({ success: true, data: recipes });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case "POST":
      // Update diet type for multiple recipes
      try {
        await authMiddleware(req, res, ["admin"]); // Protect route with middleware
        const updates = req.body.recipes;

        if (!Array.isArray(updates) || updates.length === 0) {
          return res.status(400).json({ message: "Invalid input data" });
        }

        const updatePromises = updates.map((update) => {
          return Recipe.findByIdAndUpdate(
            update._id,
            { dietType: update.dietType },
            { new: true }
          );
        });

        const updatedRecipes = await Promise.all(updatePromises);

        res.status(200).json({
          success: true,
          data: { message: "Recipes updated successfully" },
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
