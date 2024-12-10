import mongoose from "mongoose"; // You need to use the `import` syntax
import MealPlan from "../../models/MealPlan.js";
import dotenv from "dotenv";
dotenv.config();

// Helper function to convert DD-MM-YYYY to Date object
const parseDateStringToDate = (dateString) => {
  // Split the date string into [DD, MM, YYYY]
  const [day, month, year] = dateString.split("-").map(Number);

  // JavaScript's Date constructor uses a 0-indexed month (0 = January, 11 = December)
  // So, subtract 1 from the month
  // console.log({ day, month, year });
  const dateObj = new Date(Date.UTC(year, month - 1, day));
  // console.log({ dateObj });
  return dateObj;
};

const convertStringToDate = async () => {
  try {
    // Connect to MongoDB
    // console.log({ connectioString: process.env.MONGODB_CONNECTION_STRING });
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

    // Fetch all meal plans and update the days.date field
    const mealPlans = await MealPlan.find().lean();

    // Loop through each mealPlan and update the days.date field
    for (let mealPlan of mealPlans) {
      const updatedDays = mealPlan.days.map((day) => {
        // If the date is a string, convert it to a Date object
        // console.log("outside", day.date, typeof day.date, mealPlan.month);
        let { date } = day;
        console.log({ date });
        if (typeof date === "string") {
          // Convert string to Date object
          // console.log("before", date);
          const oldDate = day.date;
          const newDate = parseDateStringToDate(oldDate);
          day.date = newDate;
          console.log("after", day.date);
        }
        return day;
      });

      // Update the mealPlan document
      await MealPlan.findByIdAndUpdate(mealPlan._id, { days: updatedDays });
      // await mealPlan.save();
      console.log(`Updated meal plan with ID ${mealPlan._id}`);
    }

    console.log("MealPlan days.date field updated successfully.");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating mealPlans:", error);
    mongoose.connection.close();
  }
};

// Run the script
convertStringToDate();
