import dbConnect from "../../../../lib/dbConnect";
import { getMealPlanForDateRange } from "../../../../utils/helper";
import authMiddleware from "../../../../middleware/auth";

export default async function handler(req, res) {
  await dbConnect(); // Connect to the database

  const {
    method,
    query: { startDate, endDate },
  } = req;

  switch (method) {
    case "GET":
      try {
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }
        const mealPlansWithFilteredDays = await getMealPlanForDateRange(
          startDate,
          endDate
        );
        return res
          .status(200)
          .json({ success: true, data: mealPlansWithFilteredDays });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

    default:
      return res
        .setHeader("Allow", ["GET"])
        .status(405)
        .end(`Method ${method} Not Allowed`);
  }
}
