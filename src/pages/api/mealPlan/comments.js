import dbConnect from "../../../../lib/dbConnect";
import MealPlan from "../../../../models/mealPlan";
import User from "../../../../models/user";
import authMiddleware from "../../../../middleware/auth";

export default async function handler(req, res) {
  await dbConnect(); // Ensure the database is connected

  const { method } = req;

  switch (method) {
    case "POST":
      try {
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }

        const { mealPlanId, date, meal, comment } = req.body;
        const { userId } = req.user; // Extract user info from the request

        // Step 1: Find the meal plan by ID
        const mealPlan = await MealPlan.findById(mealPlanId);
        if (!mealPlan) {
          return res.status(404).json({ message: "Meal plan not found" });
        }

        // Step 2: Find or create the day for the comment
        let day = mealPlan.days.find((d) => d.date === date);
        if (!day) {
          day = {
            date,
            season: mealPlan.season,
            [meal]: {
              mealCounts: mealPlan.entireMonthCounts,
              recipes: [],
              comments: [],
            },
          };
          mealPlan.days.push(day);
        }

        // Step 3: Ensure the meal exists for that day
        if (!day[meal]) {
          day[meal] = {
            mealCounts: mealPlan.entireMonthCounts,
            recipes: [],
            comments: [],
          };
        }

        // Step 4: Create the comment and add it to the meal
        const user = await User.findById(userId);
        const newComment = {
          username: user.username,
          comment,
          date: new Date(),
        };
        day[meal].comments.unshift(newComment); // Add comment to the beginning

        // Step 5: Save the updated meal plan
        await mealPlan.save();

        res.status(200).json({ message: "Comment added successfully", day });
      } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Failed to add comment" });
      }
      break;

    case "DELETE":
      try {
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }

        const { mealPlanId, date, meal, commentId } = req.body;

        // Step 1: Find the meal plan by ID
        const mealPlan = await MealPlan.findById(mealPlanId);
        if (!mealPlan) {
          return res.status(404).json({ message: "Meal plan not found" });
        }

        // Step 2: Find the day and meal within the meal plan
        const day = mealPlan.days.find((d) => d.date === date);
        if (!day || !day[meal]) {
          return res
            .status(404)
            .json({ message: `${meal} not found for the specified day` });
        }

        // Step 3: Find the comment by ID and delete it
        const commentIndex = day[meal].comments.findIndex(
          (comment) => comment._id.toString() === commentId
        );
        if (commentIndex === -1) {
          return res.status(404).json({ message: "Comment not found" });
        }

        day[meal].comments.splice(commentIndex, 1); // Remove the comment

        await mealPlan.save();

        res.status(200).json({ message: "Comment deleted successfully" });
      } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Failed to delete comment" });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
