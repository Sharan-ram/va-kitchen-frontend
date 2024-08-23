import CreateForm from "@/components/mealPlan/CreateForm";
import { useState, useMemo } from "react";
import Table from "@/components/mealPlan/Table";
import { generateDaysOfMonth } from "@/helpers/utils";
import { saveNewMealPlan, updateExistingMealPlan } from "@/services/mealPlan";
import classNames from "classnames";
import Loader from "@/components/Loader";

const CreateMealPlanPage = () => {
  const [showTable, setShowTable] = useState(false);

  const [mealPlan, setMealPlan] = useState({});

  const [isNew, setIsNew] = useState();

  const [saveMealPlanLoading, setSaveMealPlanLoading] = useState(false);

  // console.log({ mealPlan });

  const saveMealPlan = async () => {
    // console.log({ mealPlan });
    try {
      setSaveMealPlanLoading(true);
      if (typeof isNew !== "undefined") {
        if (isNew) {
          await saveNewMealPlan(mealPlan);
        } else {
          await updateExistingMealPlan(mealPlan);
        }
        setIsNew(false);
        setSaveMealPlanLoading(false);
      }
    } catch (e) {
      console.error(e);
      setSaveMealPlanLoading(false);
    }
  };

  const days = useMemo(() => {
    if (!mealPlan.year || !mealPlan.month) return [];
    return generateDaysOfMonth(mealPlan.year, mealPlan.month - 1);
  }, [mealPlan.year, mealPlan.month]);

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
        setIsNew={setIsNew}
        isNew={isNew}
      />
      {showTable && (
        <Table
          year={mealPlan.year}
          month={mealPlan.month}
          mealPlan={mealPlan}
          setMealPlan={setMealPlan}
          days={days}
          page="create"
        />
      )}
      {showTable && (
        <button
          className={classNames(
            "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-5",
            saveMealPlanLoading && "opacity-50 cursor-not-allowed"
          )}
          disabled={saveMealPlanLoading}
          onClick={saveMealPlan}
        >
          {saveMealPlanLoading ? <Loader /> : "Save Meal Plan"}
        </button>
      )}
    </div>
  );
};

export default CreateMealPlanPage;
