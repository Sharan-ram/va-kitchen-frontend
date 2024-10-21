import { useState, useMemo } from "react";
import Selections from "@/components/mealPlan/render/Selections";
import { getWeeklyOrder, generateGoogleSheet } from "@/services/order";
import Loader from "@/components/Loader";
import classNames from "classnames";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { getDayBeforeGivenDate } from "@/helpers/utils";
import WeeklyOrderTableHeader from "@/components/WeeklyOrderTableHeader";
import Tabs from "@/components/Tabs";

const WeeklyOrder = () => {
  const [ingredients, setIngredients] = useState();
  const [showPurchaseOrder, setShowPurchaseOrder] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [ingredientsLoading, setIngredientsLoading] = useState(false);
  const [generatePurchaseOrderLoading, setGeneratePurchaseOrder] =
    useState(false);
  const [selectedTab, setSelectedTab] = useState("Buy");

  const fetchPurchaseOrder = async () => {
    try {
      setIngredientsLoading(true);
      const res = await getWeeklyOrder(startDate, endDate);
      setIngredients(res);
      setShowPurchaseOrder(true);
      setIngredientsLoading(false);
    } catch (e) {
      console.error(e);
      setIngredientsLoading(false);
      toast.error("Fetching Purchase Order Failed!");
    }
  };

  const generatePurchaseOrder = async (vendor) => {
    setGeneratePurchaseOrder(vendor);
    const tableData = [
      ["Ingredient", "Quantity", "Purchase Unit"], // Headers
      ...ingredients[selectedTab.toLowerCase()][vendor].map(
        ({ name, adjustment, purchaseUnit }) => [name, adjustment, purchaseUnit]
      ),
    ];

    try {
      const title = `Weekly order ${format(startDate, "dd-MM-yyyy")} - ${format(
        endDate,
        "dd-MM-yyyy"
      )}`;
      await generateGoogleSheet({
        payload: tableData,
        title,
      });
      setGeneratePurchaseOrder(false);
    } catch (error) {
      console.error("Error generating purchase order:", error);
      setGeneratePurchaseOrder(false);
      toast.error("Error generating purchase order!");
      // alert("Failed to generate purchase order.");
    }
  };

  const today = new Date();
  const dayBeforeStartDate = getDayBeforeGivenDate(startDate);

  const tabs = useMemo(() => {
    return ["All", "Buy", "Sell", "Redundant"];
  }, []);

  // console.log({ ingredients, selectedTab });

  return (
    <div>
      <Selections
        onSubmit={fetchPurchaseOrder}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        buttonText={"Show purchase order"}
        toggleMealPlan={() => setShowPurchaseOrder(false)}
        mealPlanLoading={ingredientsLoading}
      />
      {!ingredientsLoading && showPurchaseOrder && (
        <h2 className="text-xl font-semibold my-6">{`Weekly Order Generation: ${format(
          startDate,
          "dd-MM-yyyy"
        )} to ${format(endDate, "dd-MM-yyyy")}`}</h2>
      )}
      {ingredients && showPurchaseOrder && (
        <div>
          <Tabs
            tabs={tabs}
            selected={selectedTab}
            setSelectedTab={(tab) => setSelectedTab(tab)}
          />
        </div>
      )}
      {!ingredientsLoading && showPurchaseOrder && (
        <>
          <div className="my-4">
            {Object.keys(ingredients[selectedTab.toLowerCase()]).map(
              (vendor) => {
                return (
                  <div className="my-14" key={vendor}>
                    <div className="flex items-end justify-between w-full">
                      <div>
                        <h2 className="font-bold text-xl">{vendor}</h2>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className={classNames(
                            "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600",
                            (ingredientsLoading ||
                              (generatePurchaseOrderLoading &&
                                generatePurchaseOrderLoading === vendor) ||
                              !ingredients) &&
                              "cursor-not-allowed opacity-50"
                          )}
                          onClick={() => generatePurchaseOrder(vendor)}
                          disabled={
                            ingredientsLoading ||
                            (generatePurchaseOrderLoading &&
                              generatePurchaseOrderLoading === vendor) ||
                            !ingredients
                          }
                        >
                          {generatePurchaseOrderLoading &&
                          generatePurchaseOrderLoading === vendor ? (
                            <Loader />
                          ) : (
                            "Generate Purchase order"
                          )}
                        </button>
                      </div>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200 max-w-[100%] mt-4">
                      <WeeklyOrderTableHeader
                        startDate={startDate}
                        endDate={endDate}
                        dayBeforeStartDate={dayBeforeStartDate}
                      />
                      <tbody className="bg-white divide-y divide-gray-200 max-w-[100%]">
                        {ingredients[selectedTab.toLowerCase()][vendor].map(
                          (ingredient, index) => {
                            const {
                              _id,
                              name,
                              bulkOrder,
                              weeklyMealPlan,
                              remainingMealPlan,
                              currentStock,
                              adjustment,
                              purchaseUnit,
                              closingStock,
                              price,
                            } = ingredient;
                            return (
                              <tr className="border-b max-w-[100%]" key={_id}>
                                <td className="px-3 py-2 whitespace-nowrap capitalize">
                                  {index + 1}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap font-bold">
                                  {name}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-center">
                                  {weeklyMealPlan}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-center">
                                  {remainingMealPlan}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-center">
                                  {currentStock}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-center">
                                  {closingStock}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-center">
                                  {bulkOrder}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-center">
                                  <input
                                    type="text"
                                    onChange={(e) => {
                                      setIngredients({
                                        ...ingredients,
                                        [selectedTab.toLowerCase()]: {
                                          ...ingredients[
                                            selectedTab.toLowerCase()
                                          ],
                                          [vendor]: ingredients[
                                            selectedTab.toLowerCase()
                                          ][vendor].map((ing) => {
                                            if (ing._id === _id) {
                                              return {
                                                ...ing,
                                                adjustment: e.target.value,
                                              };
                                            }
                                            return ing;
                                          }),
                                        },
                                      });
                                    }}
                                    value={adjustment}
                                    className="pl-10 pr-4 py-2 border rounded-md"
                                  />
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-center">
                                  {price
                                    ? Math.abs(Math.round(adjustment * price))
                                    : ""}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-center">
                                  {purchaseUnit}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              }
            )}
          </div>
        </>
      )}

      {ingredientsLoading && (
        <div className="w-full flex justify-center items-center">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default WeeklyOrder;
