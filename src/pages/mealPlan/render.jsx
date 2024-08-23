import { useMemo, useState } from "react";
import Selections from "@/components/mealPlan/render/Selections";
import IngredientsTable from "@/components/mealPlan/render/IngredientsTable";
import Table from "@/components/mealPlan/Table";
import { generateDaysForDateRange } from "@/helpers/utils";
import Tabs from "@/components/Tabs";
import Modal from "@/components/Modal";
import UpdateRecipe from "@/components/mealPlan/render/UpdateRecipe";
import { getMealPlanBetweenDateRange } from "@/services/mealPlan";

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

  // console.log({ days });

  const tabs = useMemo(() => {
    return ["Meal Plan", "Ingredients Per Meal"];
  }, []);

  const fetchMealPlan = async ({ startDate, endDate }) => {
    // console.log({ startDate, endDate });
    try {
      setMealPlanLoading(true);
      const res = await getMealPlanBetweenDateRange(startDate, endDate);
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

  // console.log({ activeRecipe, activeMealPlan });
  console.log({ mealPlan });
  const createUpdatedMealPlanPromises = async (updatedMealPlans) => {
    try {
      const updateRequests = updatedMealPlans.map(async (mealPlan) => {
        const response = await updateExistingMealPlan(mealPlan);
        return response.data;
      });

      // Wait for all the update requests to finish
      const updatedResults = await Promise.all(updateRequests);

      // Return the updated results
      return updatedResults;
    } catch (error) {
      console.error("Error updating meal plans:", error);
      throw error;
    }
  };

  const handleRecipeUpdate = (recipe) => {
    const newMealPlan = mealPlan.map((mealPlanObj) => {
      let newMealPlanObj = { ...mealPlanObj };
      newMealPlanObj.days = newMealPlanObj.days.map((day) => {
        let newDayObj = { ...day };
        if (day.breakfast && day.breakfast.recipes) {
          newDayObj.breakfast.recipes = newDayObj.breakfast.recipes.map((r) => {
            if (r._id === recipe._id) {
              return recipe;
            } else {
              return r;
            }
          });
        }

        if (day.lunch && day.lunch.recipes) {
          newDayObj.lunch.recipes = newDayObj.lunch.recipes.map((r) => {
            if (r._id === recipe._id) {
              return recipe;
            } else {
              return r;
            }
          });
        }

        if (day.dinner && day.dinner.recipes) {
          newDayObj.dinner.recipes = newDayObj.dinner.recipes.map((r) => {
            if (r._id === recipe._id) {
              return recipe;
            } else {
              return r;
            }
          });
        }

        return newDayObj;
      });

      return newMealPlanObj;
    });

    createUpdatedMealPlanPromises(newMealPlan)
      .then((updatedResults) => {
        console.log("Meal plans updated successfully:", updatedResults);
        setMealPlan(newMealPlan);
      })
      .catch((error) => {
        console.error("Error updating meal plans:", error);
      });
  };

  const saveMealPlan = () => {};

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
            setMealPlan={(newMealPlan) => {
              const newPlans = mealPlan.map((obj) => {
                if (
                  obj.year === newMealPlan.year &&
                  obj.month === newMealPlan.month
                ) {
                  return newMealPlan;
                } else {
                  return obj;
                }
              });
              setMealPlan(newPlans);
            }}
            setActiveRecipe={({ recipe, month, year }) => {
              const selectedMealPlan = mealPlan.find(
                (obj) => obj.month === month && obj.year === year
              );
              setActiveMealPlan(selectedMealPlan);
              setActiveRecipe(recipe);
            }}
          />
          <div className="mt-6">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-5"
              onClick={saveMealPlan}
            >
              Save Meal Plan
            </button>
          </div>
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
          <UpdateRecipe
            recipe={activeRecipe}
            onUpdateRecipe={handleRecipeUpdate}
          />
        </Modal>
      )}
    </div>
  );
};

export default RenderMealPlanPage;
