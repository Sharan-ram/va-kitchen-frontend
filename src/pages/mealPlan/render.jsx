import { useMemo, useState } from "react";
import Selections from "@/components/mealPlan/render/Selections";
import axios from "axios";
import IngredientsTable from "@/components/mealPlan/render/IngredientsTable";
import Table from "@/components/mealPlan/Table";
import { format } from "date-fns";
import { generateDaysForDateRange } from "@/helpers/utils";
import Tabs from "@/components/Tabs";

const RenderMealPlanPage = () => {
  const [mealPlan, setMealPlan] = useState();
  const [showMealPlan, toggleMealPlan] = useState(false);
  const [mealPlanLoading, setMealPlanLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Meal Plan");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const days = useMemo(() => {
    if (!startDate || !endDate) return [];
    return generateDaysForDateRange(startDate, endDate);
  }, [startDate, endDate]);

  const tabs = useMemo(() => {
    return ["Meal Plan", "Ingredients Per Meal", "Costing"];
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

  console.log({ mealPlan, selectedTab, showMealPlan });

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
          />
        </div>
      )}
      {showMealPlan && selectedTab === "Ingredients Per Meal" && (
        <div className="mt-10">
          <IngredientsTable mealPlan={mealPlan} />
        </div>
      )}
    </div>
  );
};

export default RenderMealPlanPage;
