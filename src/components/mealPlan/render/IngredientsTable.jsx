import { useMemo } from "react";
import { format } from "date-fns";
import { meals, weekDays } from "@/helpers/constants";
import { generateDaysOfMonth } from "@/helpers/utils";
import { tr } from "date-fns/locale";

const IngredientsTable = ({ mealPlan, month, year }) => {
  const dates = useMemo(() => {
    return generateDaysOfMonth(year, Number(month - 1));
  }, [month, year]);

  return (
    <div>
      <table>
        <thead>
          <th>Date</th>
          <th>Meal</th>
          <th>Recipe</th>
          <th>Ingredient</th>
          <th>Quantity</th>
          <th>Vegan Count</th>
          <th>Non Vegan Count</th>
        </thead>

        <tbody>
          {dates.map((day, index) => {
            const formattedDate = format(day, "dd-MM-yyyy");
            const dateObj = mealPlan.days.find(
              (obj) => obj.date === formattedDate
            );
            const date = day.getDate();
            const dayName = day.getDay();
            return !dateObj ? null : (
              <tr>
                <td>{`${date}, ${weekDays[dayName]}`}</td>
                {meals.map((meal, index) => {
                  // return (
                  // )
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientsTable;
