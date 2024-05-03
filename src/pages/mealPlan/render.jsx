import { useMemo, useState } from "react";
import Selections from "@/components/mealPlan/render/Selections";
import axios from "axios";
import MealPlanTable from "@/components/mealPlan/render/MealPlanTable";
import IngredientsTable from "@/components/mealPlan/render/IngredientsTable";
import Table from "@/components/mealPlan/Table";
import { format } from "date-fns";
import { generateDaysForDateRange } from "@/helpers/utils";

const RenderMealPlanPage = () => {
  const [mealPlan, setMealPlan] = useState();
  const [showMealPlan, toggleMealPlan] = useState(false);
  const [mealPlanLoading, setMealPlanLoading] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const days = useMemo(() => {
    if (!startDate || !endDate) return [];
    return generateDaysForDateRange(startDate, endDate);
  }, [startDate, endDate]);

  console.log({ days });

  const fetchMealPlan = async ({ startDate, endDate }) => {
    console.log({ startDate, endDate });
    try {
      setMealPlanLoading(true);
      const res = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/mealPlan/date-range?startDate=${format(
          startDate,
          "dd-MM-yyyy"
        )}&endDate=${format(endDate, "dd-MM-yyyy")}`
      );
      console.log({ res });
      setMealPlan(res.data.data);
      setMealPlanLoading(false);
      toggleMealPlan(true);
    } catch (e) {
      setMealPlanLoading(false);
      console.error(e);
      toggleMealPlan(false);
    }
  };

  console.log({ mealPlan });

  return (
    <div>
      <Selections
        onSubmit={fetchMealPlan}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      {showMealPlan && (
        <div>
          <div className="mt-10">
            <Table
              page="render"
              days={days}
              mealPlan={mealPlan}
              setMealPlan={setMealPlan}
            />
          </div>

          {/* <div className="mt-10">
            <IngredientsTable mealPlan={mealPlan} year={year} month={month} />
          </div> */}
        </div>
      )}
    </div>
  );
};

export default RenderMealPlanPage;
