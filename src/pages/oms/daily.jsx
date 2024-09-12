import { useState } from "react";

import Selections from "@/components/mealPlan/render/Selections";
import { getDailyOrder } from "@/services/order";
import Loader from "@/components/Loader";
import MealPlanTable from "@/components/oms/daily/MealPlanTable";
import PurchaseOrderTable from "@/components/oms/daily/PurchaseOrderTable";

const DailyOrder = () => {
  const [mealPlan, setMealPlan] = useState();
  const [showMealPlan, toggleMealPlan] = useState(false);
  const [mealPlanLoading, setMealPlanLoading] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [selectAll, setSelectAll] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  const fetchMealPlan = async ({ startDate, endDate }) => {
    // console.log({ startDate, endDate });
    try {
      setMealPlanLoading(true);
      const res = await getDailyOrder(startDate, endDate);
      // console.log({ res });
      setMealPlan(res);
      setMealPlanLoading(false);
      toggleMealPlan(true);
    } catch (e) {
      setMealPlanLoading(false);
      console.error(e);
      toggleMealPlan(false);
    }
  };

  //   console.log({ selectedRecipes });

  return (
    <div>
      <Selections
        onSubmit={fetchMealPlan}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        buttonText={"Show meal plan"}
        toggleMealPlan={toggleMealPlan}
        mealPlanLoading={mealPlanLoading}
      />

      {mealPlanLoading && (
        <div className="w-full flex justify-center mt-10">
          <Loader />
        </div>
      )}

      {showMealPlan && (
        <div className="mt-10">
          <h2 className="font-semibold text-lg">Meal Plan Table</h2>
          <MealPlanTable
            mealPlan={mealPlan}
            selectedRecipes={selectedRecipes}
            setSelectedRecipes={setSelectedRecipes}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
          />
        </div>
      )}
      {showMealPlan && (selectAll || selectedRecipes.length > 0) && (
        <div className="mt-10">
          <h2 className="font-semibold text-lg">Purchase Order Table</h2>
          <PurchaseOrderTable
            mealPlan={mealPlan}
            selectedRecipes={selectedRecipes}
            selectAll={selectAll}
          />
        </div>
      )}
    </div>
  );
};

export default DailyOrder;
