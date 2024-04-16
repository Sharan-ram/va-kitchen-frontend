import { useMemo } from "react";
import { format } from "date-fns";
import { meals, weekDays } from "@/helpers/constants";
import { generateDaysOfMonth } from "@/helpers/utils";

const MealPlanTable = ({ mealPlan, year, month }) => {
  const dates = useMemo(() => {
    return generateDaysOfMonth(year, Number(month - 1));
  }, [month, year]);

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200 max-w-[100%]">
        <thead className="bg-gray-50 max-w-[100%]">
          <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Breakfast
          </th>
          <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Lunch
          </th>
          <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Dinner
          </th>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200 max-w-[100%]">
          {dates.map((day, index) => {
            const formattedDate = format(day, "dd-MM-yyyy");
            const dateObj = mealPlan.days.find(
              (obj) => obj.date === formattedDate
            );
            const date = day.getDate();
            const dayName = day.getDay();
            return !dateObj ? null : (
              <tr className="border-b max-w-[100%]">
                <td className="px-3 py-2 whitespace-nowrap">{`${date}, ${weekDays[dayName]}`}</td>
                {meals.map((meal, index) => {
                  return (
                    <td
                      key={`${meal}-${index}`}
                      className="px-3 py-2 whitespace-nowrap"
                    >
                      {dateObj[meal]?.recipes?.map((recipe, index) => {
                        console.log({ recipe });
                        return (
                          <div key={`${recipe.name}-${index}`}>
                            {recipe.name}
                          </div>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MealPlanTable;
