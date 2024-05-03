import { useMemo, useState } from "react";
import Selections from "@/components/mealPlan/render/Selections";
import axios from "axios";
import IngredientsTable from "@/components/mealPlan/render/IngredientsTable";
import Table from "@/components/mealPlan/Table";
import { format } from "date-fns";
import { generateDaysForDateRange } from "@/helpers/utils";
import Tabs from "@/components/Tabs";
import Modal from "@/components/Modal";
import UpdateRecipe from "@/components/mealPlan/render/UpdateRecipe";

const RenderMealPlanPage = () => {
  const [mealPlan, setMealPlan] = useState();
  const [showMealPlan, toggleMealPlan] = useState(false);
  const [mealPlanLoading, setMealPlanLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Meal Plan");
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [activeMealPlan, setActiveMealPlan] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const days = useMemo(() => {
    if (!startDate || !endDate) return [];
    return generateDaysForDateRange(startDate, endDate);
  }, [startDate, endDate]);

  const tabs = useMemo(() => {
    return ["Meal Plan", "Ingredients Per Meal"];
  }, []);

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

  console.log({ activeRecipe, activeMealPlan });

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
        <div className="mt-10">
          <Tabs
            tabs={tabs}
            selected={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </div>
      )}
      {showMealPlan && selectedTab === "Meal Plan" && (
        <div className="mt-10">
          <Table
            page="render"
            days={days}
            mealPlan={mealPlan}
            setMealPlan={setMealPlan}
            setActiveRecipe={({ recipe, month, year }) => {
              const selectedMealPlan = mealPlan.find(
                (obj) => obj.month === month && obj.year === year
              );
              setActiveMealPlan(selectedMealPlan);
              setActiveRecipe(recipe);
            }}
          />
        </div>
      )}
      {showMealPlan && selectedTab === "Ingredients Per Meal" && (
        <div className="mt-10">
          <IngredientsTable mealPlan={mealPlan} />
        </div>
      )}

      {activeRecipe && (
        <Modal
          closeModal={() => {
            setActiveMealPlan(null);
            setActiveRecipe(null);
          }}
        >
          <UpdateRecipe recipe={activeRecipe} />
        </Modal>
      )}
    </div>
  );
};

export default RenderMealPlanPage;
