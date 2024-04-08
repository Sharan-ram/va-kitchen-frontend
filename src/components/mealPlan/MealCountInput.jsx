import { useMemo } from "react";
import { format } from "date-fns";
import { dietTypeCounts } from "@/helpers/constants";

const MealCountInput = ({
  entireMonthCounts,
  mealPlan,
  meal,
  date,
  setMealPlan,
}) => {
  const handleInputChange = (e, meal) => {
    // Handle input change logic here
  };

  const mealCounts = mealPlan?.days?.find(
    (obj) => obj.date === format(date, "dd-MM-yyyy")
  )?.[meal]?.mealCounts;

  const getValue = (dietTypeCount) => {
    if (typeof mealCounts?.[dietTypeCount] === "undefined") {
      if (typeof entireMonthCounts?.[dietTypeCount] === "undefined") {
        return "";
      }
      return entireMonthCounts?.[dietTypeCount];
    }
    return mealCounts?.[dietTypeCount];
  };

  return (
    <div className="flex mt-2">
      {dietTypeCounts.map((dietTypeCount) => {
        return (
          <input
            key={dietTypeCount}
            type="number"
            placeholder={dietTypeCount}
            onChange={(e) => handleInputChange(e, dietTypeCount)}
            className="flex-1 mr-2 pl-2 py-1 border rounded-md"
            value={getValue(dietTypeCount)}
          />
        );
      })}
    </div>
  );
};

export default MealCountInput;
