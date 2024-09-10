import { useMemo, useState } from "react";
import Selections from "@/components/mealPlan/render/Selections";
import IngredientsTable from "@/components/mealPlan/render/IngredientsTable";
import Table from "@/components/mealPlan/Table";
import { generateDaysForDateRange } from "@/helpers/utils";
import Tabs from "@/components/Tabs";
import Modal from "@/components/Modal";
import UpdateRecipe from "@/components/mealPlan/render/UpdateRecipe";
import {
  getMealPlanBetweenDateRange,
  updateExistingMealPlan,
} from "@/services/mealPlan";
import { generateGoogleSheet } from "@/services/order";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import classNames from "classnames";
import { format } from "date-fns";
import TotalIngredientsQuantity from "@/components/mealPlan/render/TotalIngredientsQuantity";

const RenderMealPlanPage = () => {
  const [mealPlan, setMealPlan] = useState();
  const [showMealPlan, toggleMealPlan] = useState(false);
  const [mealPlanLoading, setMealPlanLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Meal Plan");
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [activeMealPlan, setActiveMealPlan] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [saveMealPlanLoading, setSaveMealPlanLoading] = useState(false);
  const [gSheetExportLoading, setGSheetExportLoading] = useState(false);

  const days = useMemo(() => {
    if (!startDate || !endDate) return [];
    return generateDaysForDateRange(startDate, endDate);
  }, [startDate, endDate]);

  // console.log({ days });

  const tabs = useMemo(() => {
    return ["Meal Plan", "Ingredients Per Meal", "Total Ingredients Quantity"];
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

    setMealPlan(newMealPlan);
    setActiveRecipe(false);
  };

  const saveMealPlan = async () => {
    setSaveMealPlanLoading(true);
    createUpdatedMealPlanPromises(mealPlan)
      .then((updatedResults) => {
        console.log("Meal plans updated successfully:", updatedResults);
        toast.success("Meal plan updated successfully!");
        setSaveMealPlanLoading(false);
      })
      .catch((error) => {
        setSaveMealPlanLoading(false);
        toast.error("Error. Try again later!");
        console.error("Error updating meal plans:", error);
      });
  };

  const exportToGSheets = async () => {
    setGSheetExportLoading(true);
    const data = [];
    mealPlan.forEach((mealPlanObj) => {
      mealPlanObj.days.forEach((dayObj) => {
        let dayArr = [dayObj.date];
        ["breakfast", "lunch", "dinner"].forEach((meal, mealIndex) => {
          if (dayObj[meal]) {
            // Use a Set to ensure unique recipe names
            const uniqueRecipes = new Set();

            dayObj[meal].recipes?.forEach((recipeObj) => {
              // Remove ' - Vegan' or ' - Non Vegan' from the recipe name
              const recipeName = recipeObj.name.replace(
                / - Vegan| - Non Vegan/,
                ""
              );

              // Add the recipe name to the Set if it hasn't been added already
              uniqueRecipes.add(recipeName);
            });

            // Join all unique recipe names with newlines
            dayArr[mealIndex + 1] = Array.from(uniqueRecipes).join("\n");
          } else {
            dayArr[mealIndex + 1] = ""; // No meal data
          }
        });

        data.push(dayArr);
      });
    });

    // console.log({ data });
    const tableData = [["Date", "Breakfast", "Lunch", "Dinner"], ...data];

    try {
      const title = `${format(startDate, "dd-MM-yyyy")} to ${format(
        endDate,
        "dd-MM-yyyy"
      )} Meal Plan`;
      const res = await generateGoogleSheet({
        payload: tableData,
        title,
      });
      if (res.data.success) {
        // Open the Google Sheet in a new tab
        window.open(res.data.sheetUrl, "_blank");
        setGSheetExportLoading(false);
      }
    } catch (error) {
      console.error("Error exporting to Google Sheet:", error);
      setGSheetExportLoading(false);
      toast.error("Error exporting to Google Sheet!");
      // alert("Failed to generate purchase order.");
    }
  };

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
          <div>
            <button
              className={classNames(
                "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-5",
                gSheetExportLoading && "cursor-not-allowed"
              )}
              onClick={exportToGSheets}
              disabled={gSheetExportLoading}
            >
              {gSheetExportLoading ? <Loader /> : "Export to Google Sheets"}
            </button>
          </div>
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
              className={classNames(
                "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-5",
                saveMealPlanLoading && "cursor-not-allowed"
              )}
              onClick={saveMealPlan}
              disabled={saveMealPlanLoading}
            >
              {saveMealPlanLoading ? <Loader /> : "Save Meal Plan"}
            </button>
          </div>
        </div>
      )}
      {showMealPlan && selectedTab === "Ingredients Per Meal" && (
        <div className="mt-10">
          <IngredientsTable mealPlan={mealPlan} />
        </div>
      )}
      {showMealPlan && selectedTab === "Total Ingredients Quantity" && (
        <div className="mt-10">
          <TotalIngredientsQuantity mealPlan={mealPlan} />
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
