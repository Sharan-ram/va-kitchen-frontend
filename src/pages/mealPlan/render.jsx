import { useState } from "react";
import Selections from "@/components/mealPlan/render/Selections";
import axios from "axios";
import MealPlanTable from "@/components/mealPlan/render/MealPlanTable";
import IngredientsTable from "@/components/mealPlan/render/IngredientsTable";
import { format } from "date-fns";

const RenderMealPlanPage = () => {
  const [mealPlan, setMealPlan] = useState({});
  const [showMealPlan, toggleMealPlan] = useState(false);

  const fetchMealPlan = async ({ startDate, endDate }) => {
    console.log({ startDate, endDate });
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/mealPlan?startDate=${format(
        startDate,
        "dd-MM-yyyy"
      )}&endDate=${format(endDate, "dd-MM-yyyy")}`
    );
    console.log({ res });
  };

  console.log({ mealPlan });

  return (
    <div>
      <Selections onSubmit={fetchMealPlan} />
      {showMealPlan && (
        <div>
          {/* <div className="mt-10">
            <MealPlanTable mealPlan={mealPlan} year={year} month={month} />
          </div> */}

          {/* <div className="mt-10">
            <IngredientsTable mealPlan={mealPlan} year={year} month={month} />
          </div> */}
        </div>
      )}
    </div>
  );
};

export default RenderMealPlanPage;
