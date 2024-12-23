import dbConnect from "../../../../lib/dbConnect";
import MealPlan from "../../../../models/MealPlan";
import authMiddleware from "../../../../middleware/auth";
import {
  processMealPlanDays,
  populateMealPlanRecipesForDateRange,
} from "../../../../utils/helper";
import { parseISO, format, isValid } from "date-fns";
// import decompressMiddleware from "../../../../middleware/decompression";

const parsedAndFormattedDate = (input) => {
  let date;

  // Check if the input is already a Date object
  if (input instanceof Date) {
    date = input;
  } else if (typeof input === "string") {
    // Parse the ISO string
    date = parseISO(input);
  } else {
    throw new Error("Invalid input: expected a Date object or an ISO string");
  }

  // Validate the parsed date
  if (!isValid(date)) {
    throw new Error("Invalid date");
  }

  // Format the valid date
  return format(date, "dd-MM-yyyy");
};

export default async function handler(req, res) {
  await dbConnect(); // Connect to the database
  const {
    method,
    query: { id },
  } = req;
  // console.log({ bodyBefore: req.body });
  // await decompressMiddleware(req, res);

  switch (method) {
    case "PUT":
      try {
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }

        const updatedFields = req.body;

        const mealPlan = await MealPlan.findById(id);
        if (!mealPlan) {
          return res
            .status(404)
            .json({ success: false, message: "Meal plan not found" });
        }

        for (const key in updatedFields) {
          if (key !== "days") {
            mealPlan[key] = updatedFields[key];
          }
        }

        // Process and update days array: extract recipe _ids
        if (updatedFields.days && Array.isArray(updatedFields.days)) {
          const newDays = processMealPlanDays(updatedFields.days);
          const newDaysMap = {};
          newDays.forEach((obj) => {
            newDaysMap[parsedAndFormattedDate(obj.date)] = obj;
          });
          const mealPlanDays = mealPlan.days.map((dayObj) => {
            const formattedDate = parsedAndFormattedDate(dayObj.date);
            if (newDaysMap[formattedDate]) {
              return newDaysMap[formattedDate];
            }
            return dayObj;
          });

          Object.keys(newDaysMap).forEach((formattedDate) => {
            if (
              !mealPlanDays.some(
                (dayObj) =>
                  parsedAndFormattedDate(dayObj.date) === formattedDate
              )
            ) {
              mealPlanDays.push(newDaysMap[formattedDate]);
            }
          });

          // console.log("newDays", JSON.stringify(newDays));

          const updatedMealPlan = await MealPlan.findByIdAndUpdate(
            mealPlan._id,
            { $set: { days: mealPlanDays } },
            { new: true } // Ensures we get the updated document
          );
          console.log("updatedMealPlan", JSON.stringify(updatedMealPlan));
        }

        const updatedMealPlan = await MealPlan.findById(mealPlan._id).populate(
          populateMealPlanRecipesForDateRange({
            ingredientFieldsSelect: "_id name",
          })
        );

        return res.status(200).json({ success: true, data: updatedMealPlan });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

    default:
      return res
        .setHeader("Allow", ["PUT"])
        .status(405)
        .end(`Method ${method} Not Allowed`);
  }
}
