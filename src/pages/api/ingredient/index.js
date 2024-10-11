console.log("Ingredient API file loaded"); // Add this at the very top

import dbConnect from "../../../../lib/dbConnect";
import Ingredient from "../../../../models/Ingredient";
import authMiddleware from "../../../../middleware/auth";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;
  console.log({ method });
  switch (method) {
    case "GET":
      // Get all ingredients
      try {
        console.log(".................API is called");
        const searchText = req.query.search || "";
        const query = searchText
          ? { name: { $regex: new RegExp(searchText, "i") } }
          : {};
        const ingredients = await Ingredient.find(query).sort({ name: 1 });
        // console.log({ ingredients });
        res.status(200).json({ success: true, data: ingredients });
      } catch (error) {
        console.log({ error });
        res.status(500).json({ success: false, message: error.message });
      }
      break;
    case "POST":
      // Create a new ingredient
      try {
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }
        const newIngredient = new Ingredient(req.body);
        const savedIngredient = await newIngredient.save();
        res.status(201).json(savedIngredient);
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
