import { useState, useEffect, useMemo } from "react";
import { getMonthlyOrder, generateGoogleSheet } from "@/services/order";

import { getCurrentMonth, getNextMonth } from "@/helpers/utils";
import Loader from "@/components/Loader";

import { toast } from "react-toastify";
import classNames from "classnames";
import Tabs from "@/components/Tabs";
import MonthlyOrderTableHeader from "@/components/MonthlyOrderTableHeader";

const MonthlyOrder = () => {
  const [ingredients, setIngredients] = useState();
  const [loading, setLoading] = useState(false);
  const [generateOrderInProgress, setGenerateOrder] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Buy");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getMonthlyOrder();
        setIngredients(res);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
        toast.error("Error fetching. Try again later!");
      }
    };

    fetchData();
  }, []);

  // console.log({ ing: ingredients[selectedTab][vendor] });

  const generatePurchaseOrder = async (vendor) => {
    setGenerateOrder(vendor);
    const tableData = [
      ["Ingredient", "Quantity", "Purchase Unit"], // Headers
      ...ingredients[selectedTab.toLowerCase()][vendor]
        .filter(
          (ingredient) => ingredient.adjustment > 0 && !ingredient.sponsored
        )
        .map(({ name, adjustment, purchaseUnit }) => [
          name,
          adjustment,
          purchaseUnit,
        ]),
    ];

    try {
      const res = await generateGoogleSheet({
        payload: tableData,
        title: `${nextMonth} Purchase Order`,
      });
      if (res.data.success) {
        // Open the Google Sheet in a new tab
        window.open(res.data.sheetUrl, "_blank");
        setGenerateOrder(false);
      }
    } catch (error) {
      console.error("Error generating purchase order:", error);
      setGenerateOrder(false);
      toast.error("Error generating purchase order!");
    }
  };

  const currentMonth = getCurrentMonth();
  const nextMonth = getNextMonth();

  const tabs = useMemo(() => {
    return ["All", "Buy", "Sell", "Redundant"];
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Current Month - {currentMonth}, Monthly Order Generation for -{" "}
        {nextMonth}
      </h2>
      {ingredients && (
        <div>
          <Tabs
            tabs={tabs}
            selected={selectedTab}
            setSelectedTab={(tab) => setSelectedTab(tab)}
          />
        </div>
      )}
      <div className="my-4">
        {ingredients ? (
          Object.keys(ingredients[selectedTab.toLowerCase()]).map((vendor) => {
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
                        (loading ||
                          (generateOrderInProgress &&
                            generateOrderInProgress === vendor) ||
                          !ingredients) &&
                          "cursor-not-allowed opacity-50"
                      )}
                      onClick={() => generatePurchaseOrder(vendor)}
                      disabled={
                        loading ||
                        (generateOrderInProgress &&
                          generateOrderInProgress === vendor) ||
                        !ingredients
                      }
                    >
                      {generateOrderInProgress &&
                      generateOrderInProgress === vendor ? (
                        <Loader />
                      ) : (
                        "Generate Purchase order"
                      )}
                    </button>
                  </div>
                </div>
                <table className="min-w-full divide-y divide-gray-200 max-w-[100%] mt-4">
                  <MonthlyOrderTableHeader />
                  <tbody className="bg-white divide-y divide-gray-200 max-w-[100%]">
                    {ingredients[selectedTab.toLowerCase()][vendor].map(
                      (ingredient, index) => {
                        const {
                          _id,
                          name,
                          bulkOrder,
                          monthlyMealPlan,
                          remainingMealPlan,
                          currentStock,
                          adjustment,
                          purchaseUnit,
                          closingStock,
                        } = ingredient;
                        return (
                          <tr className="border-b max-w-[100%]" key={_id}>
                            <td className="px-3 py-2 whitespace-nowrap capitalize">
                              {index + 1}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap font-bold max-w-[300px] overflow-hidden text-ellipsis">
                              {name}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                              {monthlyMealPlan}
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
                                  const updatedIngredients = ingredients.map(
                                    (ing) => {
                                      // console.log({ ingredient, ing });
                                      if (ing._id === ingredient._id) {
                                        return {
                                          ...ingredient,
                                          adjustment: e.target.value,
                                        };
                                      }
                                      return ing;
                                    }
                                  );
                                  setIngredients(updatedIngredients);
                                }}
                                value={adjustment}
                                className="pl-10 pr-4 py-2 border rounded-md"
                              />
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
          })
        ) : (
          <div className="w-full text-center flex justify-center items-center">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyOrder;
