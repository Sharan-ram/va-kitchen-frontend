import dbConnect from "../../../../lib/dbConnect";
import Ingredient from "../../../../models/ingredient";
import authMiddleware from "../../../../middleware/auth";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case "GET":
      try {
        const ingredient = await Ingredient.findById(id);
        if (!ingredient)
          return res
            .status(404)
            .json({ success: false, message: "Ingredient not found" });
        res.status(200).json({ success: true, data: ingredient });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;
    case "PUT":
      try {
        if (!authMiddleware(req, res, ["admin"])) {
          return;
        }
        const updatedIngredient = await Ingredient.findByIdAndUpdate(
          id,
          req.body,
          { new: true }
        );
        if (!updatedIngredient)
          return res
            .status(404)
            .json({ success: false, message: "Ingredient not found" });
        res.status(200).json({ success: true, data: updatedIngredient });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;
    case "DELETE":
      try {
        if (!authMiddleware(req, res, ["admin"])) {
          return;
        }
        const deletedIngredient = await Ingredient.findByIdAndDelete(id);
        if (!deletedIngredient)
          return res
            .status(404)
            .json({ success: false, message: "Ingredient not found" });
        res
          .status(200)
          .json({ success: true, message: "Ingredient deleted successfully" });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
