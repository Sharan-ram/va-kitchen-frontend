import dbConnect from "../../../../lib/dbConnect";
import TempRecipe from "../../../../models/TempRecipe";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "POST":
      // Create a new recipe
      try {
        const tempRecipe = await TempRecipe.create(req.body);
        res.status(201).json({ success: true, data: tempRecipe });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
