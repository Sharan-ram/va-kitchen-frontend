import { format } from "date-fns";
import { dietTypeCounts } from "@/helpers/constants";

const MealCountInput = ({
  entireMonthCounts,
  mealPlan,
  meal,
  date,
  setMealPlan,
}) => {
  const handleInputChange = (e, dietTypeCount) => {
    const { value } = e.target;
    let newMealPlan = JSON.parse(JSON.stringify(mealPlan));
    // console.log("newMealPlan before", newMealPlan);
    if (newMealPlan.days) {
      const selectedDateObjIndex = newMealPlan.days.findIndex((obj) => {
        // console.log({
        //   objDate: obj.date,
        //   absoluteDate: format(date, "dd-MM-yyyy"),
        // });
        return obj.date === format(date, "dd-MM-yyyy");
      });

      if (selectedDateObjIndex >= 0) {
        let mealObj = newMealPlan.days?.[selectedDateObjIndex]?.[meal];
        if (mealObj) {
          // mealObj = {
          //   ...mealObj,
          //   mealCounts: {
          //     ...entireMonthCounts,
          //     ...mealObj.mealCounts,
          //     [dietTypeCount]: Number(value),
          //   },
          // };
          // console.log("inside here");
          newMealPlan.days[selectedDateObjIndex][meal] = {
            ...mealObj,
            mealCounts: {
              ...entireMonthCounts,
              ...mealObj.mealCounts,
              [dietTypeCount]: Number(value),
            },
          };
          // console.log({ newMealPlan });
        } else {
          newMealPlan.days[selectedDateObjIndex][meal] = {
            mealCounts: {
              ...entireMonthCounts,
              [dietTypeCount]: Number(value),
            },
            recipes: [],
          };
        }
      } else {
        newMealPlan = {
          ...newMealPlan,
          days: [
            ...newMealPlan.days,
            {
              date: format(date, "dd-MM-yyyy"),
              [meal]: {
                mealCounts: {
                  ...entireMonthCounts,
                  [dietTypeCount]: Number(value),
                },
                recipes: [],
              },
              season: newMealPlan.season,
            },
          ],
        };
      }
    } else {
      newMealPlan = {
        ...newMealPlan,
        days: [
          {
            date: format(date, "dd-MM-yyyy"),
            [meal]: {
              mealCounts: {
                ...entireMonthCounts,
                [dietTypeCount]: Number(value),
              },
              recipes: [],
            },
            season: newMealPlan.season,
          },
        ],
      };
      // console.log("inside else for no days", newMealPlan);
    }

    setMealPlan(newMealPlan);
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
    <div className="flex mt-2 justify-between">
      {dietTypeCounts.map((dietTypeCount) => {
        return (
          <div className="w-[30%]" key={dietTypeCount}>
            <div>
              <p className="text-sm font-semibold">
                {dietTypeCount === "veganCount"
                  ? "Vegan"
                  : dietTypeCount === "nonVeganCount"
                  ? "Non Vegan"
                  : "Gluten Free"}
              </p>
            </div>
            <div className="w-full">
              <input
                type="number"
                placeholder={dietTypeCount}
                onChange={(e) => handleInputChange(e, dietTypeCount)}
                className="w-full pl-2 py-1 border rounded-md"
                value={getValue(dietTypeCount)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MealCountInput;
