import dbConnect from "../../../../lib/dbConnect";
import Ingredient from "../../../../models/Ingredient";
import authMiddleware from "../../../../middleware/auth";

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "GET": // Stock summary
      try {
        authMiddleware(req, res, ["admin", "user"]);
        const ingredients = await Ingredient.find(
          {},
          "_id name stock purchaseUnit"
        ).sort({ name: 1 });
        res.status(200).json({ success: true, data: ingredients });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case "POST": // Update stock
      try {
        authMiddleware(req, res, ["admin"]);
        const updates = req.body.ingredients;

        if (!Array.isArray(updates) || updates.length === 0) {
          return res.status(400).json({ message: "Invalid input data" });
        }

        const updatePromises = updates.map((update) =>
          Ingredient.findByIdAndUpdate(
            update._id,
            { stock: update.stock },
            { new: true }
          )
        );
        await Promise.all(updatePromises);

        res
          .status(200)
          .json({ success: true, message: "Stock updated successfully" });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
