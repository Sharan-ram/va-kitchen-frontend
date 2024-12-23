import { useMemo, useState } from "react";
import Selections from "@/components/mealPlan/render/Selections";
import IngredientsTable from "@/components/mealPlan/render/IngredientsTable";
import Table from "@/components/mealPlan/Table";
import {
  generateDaysForDateRange,
  parsedAndFormattedDate,
} from "@/helpers/utils";
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
import CommentsModal from "@/components/mealPlan/render/CommentsModal";

const RenderMealPlanPage = () => {
  const [mealPlan, setMealPlan] = useState();
  const [showMealPlan, toggleMealPlan] = useState(false);
  const [mealPlanLoading, setMealPlanLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Meal Plan");
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [activeMealPlan, setActiveMealPlan] = useState(null);
  const [activeRecipeType, setActiveRecipeType] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [saveMealPlanLoading, setSaveMealPlanLoading] = useState(false);
  const [gSheetExportLoading, setGSheetExportLoading] = useState(false);

  const [activeMealForComments, setActiveMealForComments] = useState();

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

  const handleRecipeUpdate = (tempRecipe, updateMealPlan) => {
    if (!updateMealPlan) {
      setActiveRecipe(false);
      return;
    }

    // console.log("====================inside");

    const newMealPlan = mealPlan.map((mealPlanObj) => {
      // console.log({ mealPlanBefore: mealPlanObj });
      let newMealPlanObj = { ...mealPlanObj };
      newMealPlanObj.days = newMealPlanObj.days.map((day) => {
        let newDayObj = { ...day };
        if (day.earlyMorning && day.earlyMorning.recipes) {
          // console.log({ earlyMorning: day.earlyMorning });
          newDayObj.earlyMorning = {
            ...day.earlyMorning,
            tempRecipes: [...(day.earlyMorning.tempRecipes || [])],
          };
          newDayObj.earlyMorning.recipes.forEach((r) => {
            // console.log("recipes map", tempRecipe, activeRecipe);
            if (r._id === activeRecipe.originalRecipe) {
              // console.log("actove recipe matched in early morning");
              newDayObj.earlyMorning.tempRecipes.push({
                originalRecipe: activeRecipe.originalRecipe,
                tempRecipe: tempRecipe._id,
              });
            }
          });
        }

        if (day.breakfast && day.breakfast.recipes) {
          newDayObj.breakfast = {
            ...day.breakfast,
            tempRecipes: [...(day.breakfast.tempRecipes || [])],
          };
          newDayObj.breakfast.recipes.forEach((r) => {
            if (r._id === activeRecipe.originalRecipe) {
              newDayObj.breakfast.tempRecipes.push({
                originalRecipe: activeRecipe.originalRecipe,
                tempRecipe: tempRecipe._id,
              });
            }
          });
        }

        if (day.lunch && day.lunch.recipes) {
          newDayObj.lunch = {
            ...day.lunch,
            tempRecipes: [...(day.lunch.tempRecipes || [])],
          };
          newDayObj.lunch.recipes.forEach((r) => {
            if (r._id === activeRecipe.originalRecipe) {
              newDayObj.lunch.tempRecipes.push({
                originalRecipe: activeRecipe.originalRecipe,
                tempRecipe: tempRecipe._id,
              });
            }
          });
        }

        if (day.evening && day.evening.recipes) {
          newDayObj.evening = {
            ...day.evening,
            tempRecipes: [...(day.evening.tempRecipes || [])],
          };
          newDayObj.evening.recipes.forEach((r) => {
            if (r._id === activeRecipe.originalRecipe) {
              newDayObj.evening.tempRecipes.push({
                originalRecipe: activeRecipe.originalRecipe,
                tempRecipe: tempRecipe._id,
              });
            }
          });
        }

        if (day.dinner && day.dinner.recipes) {
          newDayObj.dinner = {
            ...day.dinner,
            tempRecipes: [...(day.dinner.tempRecipes || [])],
          };
          newDayObj.dinner.recipes.forEach((r) => {
            if (r._id === activeRecipe.originalRecipe) {
              newDayObj.dinner.tempRecipes.push({
                originalRecipe: activeRecipe.originalRecipe,
                tempRecipe: tempRecipe._id,
              });
            }
          });
        }

        return newDayObj;
      });

      return newMealPlanObj;
    });

    // console.log({ newMealPlanAfter: newMealPlan });

    setMealPlan(newMealPlan);
    setActiveRecipe(false);
  };

  const saveMealPlan = async () => {
    setSaveMealPlanLoading(true);
    createUpdatedMealPlanPromises(mealPlan)
      .then((updatedResults) => {
        // console.log("Meal plans updated successfully:", updatedResults);
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
        ["breakfast", "lunch", "dinner"].forEach((meal, mealIndex) => {
          let mealArr = [dayObj.date, meal.toUpperCase()];
          let uniqueRecipes;

          if (dayObj[meal]) {
            uniqueRecipes = new Set();

            dayObj[meal].recipes?.forEach((recipeObj) => {
              const recipeName = recipeObj.name
                .replace(/ - Vegan| - Non Vegan| - Gluten Free/, "")
                .replace(/\s*\(.*?\)/g, "");

              uniqueRecipes.add(recipeName.trim());
            });

            const cell = Array.from(uniqueRecipes).join(", ");
            mealArr.push(cell);
          } else {
            mealArr.push("");
          }

          data.push(mealArr);
        });

        data.push(["", "", "", ""]);
      });
    });

    const tableData = [["Date", "Meal", "Menu", "Bungalow Menu"], ...data];

    try {
      const title = `${format(startDate, "dd-MM-yyyy")} to ${format(
        endDate,
        "dd-MM-yyyy"
      )} Meal Plan`;

      // console.log({ tableData });

      // Call the API to generate the Google Sheet
      await generateGoogleSheet({
        payload: tableData,
        title,
      });
      setGSheetExportLoading(false);
    } catch (error) {
      console.error("Error exporting to Google Sheet:", error);
      setGSheetExportLoading(false);
      toast.error("Error exporting to Google Sheet!");
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
        disabled={!startDate || !endDate || mealPlanLoading}
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
            setActiveRecipe={({ recipe, month, year, date, meal }) => {
              const selectedMealPlan = mealPlan.find(
                (obj) => obj.month === month && obj.year === year
              );
              const dayIndex = selectedMealPlan.days.findIndex(
                (dayObj) =>
                  parsedAndFormattedDate(dayObj.date) ===
                  parsedAndFormattedDate(date)
              );
              console.log({ selectedMealPlan, dayIndex, meal });
              const tempRecipes =
                selectedMealPlan.days[dayIndex][meal].tempRecipes;

              const tempRecipeObj = tempRecipes?.find(
                (tR) => tR.originalRecipe === recipe._id
              );
              // console.log({ tempRecipeObj });

              setActiveMealPlan(selectedMealPlan);
              setActiveRecipe(
                tempRecipeObj
                  ? tempRecipeObj
                  : { name: recipe.name, originalRecipe: recipe._id }
              );
              setActiveRecipeType(
                tempRecipeObj ? "tempRecipe" : "originalRecipe"
              );
            }}
            setActiveMealForComments={setActiveMealForComments}
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
            setActiveRecipeType(null);
          }}
        >
          <UpdateRecipe
            recipe={activeRecipe}
            recipeType={activeRecipeType}
            onUpdateRecipe={handleRecipeUpdate}
          />
        </Modal>
      )}

      {activeMealForComments && (
        <Modal
          closeModal={() => {
            setActiveMealForComments(null);
          }}
        >
          <CommentsModal
            {...activeMealForComments}
            setActiveMealForComments={setActiveMealForComments}
            fetchMealPlan={() => fetchMealPlan({ startDate, endDate })}
            startDate={startDate}
            endDate={endDate}
          />
        </Modal>
      )}
    </div>
  );
};

export default RenderMealPlanPage;
