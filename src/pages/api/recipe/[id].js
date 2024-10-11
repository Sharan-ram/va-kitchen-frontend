import dbConnect from "../../../../lib/dbConnect";
import Recipe from "../../../../models/Recipe";
import authMiddleware from "../../../../middleware/auth";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      // GET recipe by ID
      try {
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }

        const recipe = await Recipe.findById(id);

        // Check if recipe exists
        if (!recipe) {
          return res
            .status(404)
            .json({ success: false, message: "Recipe not found" });
        }

        res.status(200).json({ success: true, data: recipe });
      } catch (error) {
        // Handle invalid ObjectId or other server errors
        if (error.kind === "ObjectId") {
          return res
            .status(400)
            .json({ success: false, message: "Invalid recipe ID format" });
        }
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case "PUT":
      // Update a recipe by ID
      try {
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        // Check if recipe exists
        if (!updatedRecipe) {
          return res
            .status(404)
            .json({ success: false, message: "Recipe not found" });
        }

        res.status(200).json({ success: true, data: updatedRecipe });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
