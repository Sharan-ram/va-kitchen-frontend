import dbConnect from "../../../../lib/dbConnect";
import TempRecipe from "../../../../models/TempRecipe";
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

        const tempRecipe = await TempRecipe.findById(id).populate({
          path: "ingredients.ingredient", // Path to populate
          select: "_id name", // Fields to include in the populated data
        });

        // Check if recipe exists
        if (!tempRecipe) {
          return res
            .status(404)
            .json({ success: false, message: "Recipe not found" });
        }

        res.status(200).json({ success: true, data: tempRecipe });
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

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
