import { useState } from "react";
import Selections from "@/components/mealPlan/render/Selections";
import axios from "axios";
import MealPlanTable from "@/components/mealPlan/render/MealPlanTable";

const RenderMealPlanPage = () => {
  const [mealPlan, setMealPlan] = useState({});
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [showMealPlan, toggleMealPlan] = useState(false);

  const fetchMealPlan = async ({ year, month, startDate, endDate }) => {
    const newStartDate = startDate.length === 1 ? `0${startDate}` : startDate;
    const newEndDate = endDate.length === 1 ? `0${endDate}` : endDate;
    const newMonth = month.length === 1 ? `0${month}` : month;
    const startDateFull = `${newStartDate}-${newMonth}-${year}`;
    const endDateFull = `${newEndDate}-${newMonth}-${year}`;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/mealPlan?startDate=${startDateFull}&endDate=${endDateFull}`
    );
    setMealPlan(res.data.data[0] || {});
    if (res.data.data[0]) {
      toggleMealPlan(true);
      setYear(year);
      setMonth(month);
    }
  };

  console.log({ mealPlan });

  return (
    <div>
      <Selections onSubmit={fetchMealPlan} />
      {showMealPlan && (
        <MealPlanTable mealPlan={mealPlan} year={year} month={month} />
      )}
    </div>
  );
};

export default RenderMealPlanPage;
