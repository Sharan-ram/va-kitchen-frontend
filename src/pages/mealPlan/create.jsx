import CreateForm from "@/components/mealPlan/CreateForm";
import { useState } from "react";
import Table from "@/components/mealPlan/Table";

const CreateMealPlanPage = () => {
  const [showTable, setShowTable] = useState(false);

  const [mealPlan, setMealPlan] = useState({});

  console.log({ mealPlan });

  return (
    <div>
      <CreateForm
        showTable={(val) => setShowTable(val)}
        setMealPlan={setMealPlan}
        mealPlan={mealPlan}
        entireMonthCounts={
          mealPlan.entireMonthCounts || {
            veganCount: 0,
            nonVeganCount: 0,
            glutenFreeCount: 0,
          }
        }
      />
      {showTable && (
        <Table
          year={mealPlan.year}
          month={mealPlan.month}
          mealPlan={mealPlan}
          setMealPlan={setMealPlan}
        />
      )}
      {showTable && (
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-5">
          Save Meal Plan
        </button>
      )}
    </div>
  );
};

export default CreateMealPlanPage;
