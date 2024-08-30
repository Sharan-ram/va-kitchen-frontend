import { useState } from "react";
import Selections from "@/components/mealPlan/render/Selections";
import { getWeeklyOrder, generateMonthlyPurchaseOrder } from "@/services/order";
import Loader from "@/components/Loader";
import classNames from "classnames";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { getDayBeforeGivenDate } from "@/helpers/utils";

const WeeklyOrder = () => {
  const [ingredients, setIngredients] = useState();
  const [showPurchaseOrder, setShowPurchaseOrder] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [ingredientsLoading, setIngredientsLoading] = useState(false);
  const [generatePurchaseOrderLoading, setGeneratePurchaseOrder] =
    useState(false);

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

  const generatePurchaseOrder = async () => {
    setGeneratePurchaseOrder(true);
    const tableData = [
      [
        "Ingredient",
        "Requirement (Next Week)",
        "Requirement (Rest)",
        "Current Stock",
        "Closing Stock (as on start date)",
        "Bulk order",
        "Adjustment",
        "Purchase Unit",
      ], // Headers
      ...ingredients.map(
        ({
          name,
          bulkOrder,
          weeklyMealPlan,
          remainingMealPlan,
          currentStock,
          adjustment,
          purchaseUnit,
          closingStock,
        }) => [
          name,
          weeklyMealPlan,
          remainingMealPlan,
          currentStock,
          closingStock,
          bulkOrder,
          adjustment,
          purchaseUnit,
        ]
      ),
    ];

    try {
      const res = await generateMonthlyPurchaseOrder(tableData);
      if (res.data.success) {
        // Open the Google Sheet in a new tab
        window.open(res.data.sheetUrl, "_blank");
        setGeneratePurchaseOrder(false);
      }
    } catch (error) {
      console.error("Error generating purchase order:", error);
      setGeneratePurchaseOrder(false);
      toast.error("Error generating purchase order!");
      // alert("Failed to generate purchase order.");
    }
  };

  const today = new Date();
  const dayBeforeStartDate = getDayBeforeGivenDate(startDate);

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
      />
      <h2 className="text-xl font-semibold my-6">{`Weekly Order Generation: ${format(
        startDate,
        "dd-MM-yyyy"
      )} to ${format(endDate, "dd-MM-yyyy")}`}</h2>
      {!ingredientsLoading && showPurchaseOrder && (
        <>
          <div className="my-4">
            <table className="min-w-full divide-y divide-gray-200 max-w-[100%]">
              <thead className="bg-gray-50 max-w-[100%] sticky top-[100px]">
                <tr className="bg-gray-200">
                  <th className="px-3 py-2 font-bold uppercase tracking-wider">
                    Ingredient
                  </th>
                  <th className="px-3 py-2 font-bold uppercase tracking-wider">
                    {`Requirement (${format(startDate, "dd-MM-yyyy")} to
                      ${format(endDate, "dd-MM-yyyy")})`}
                  </th>
                  <th className="px-3 py-2 font-bold uppercase tracking-wider">
                    {`Requirement (${format(today, "dd-MM-yyyy")} to
                      ${format(dayBeforeStartDate, "dd-MM-yyyy")})`}
                  </th>
                  <th className="px-3 py-2 font-bold uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-3 py-2 font-bold uppercase tracking-wider">
                    {`Closing Stock (as on ${format(
                      dayBeforeStartDate,
                      "dd-MM-yyyy"
                    )})`}
                  </th>
                  <th className="px-3 py-2 font-bold uppercase tracking-wider">
                    Bulk order
                  </th>
                  <th className="px-3 py-2 font-bold uppercase tracking-wider">
                    Adjustment
                  </th>
                  <th className="px-3 py-2 font-bold uppercase tracking-wider">
                    Purchase Unit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 max-w-[100%]">
                {ingredients &&
                  ingredients.map((ingredient, index) => {
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
                    } = ingredient;
                    return (
                      <tr className="border-b max-w-[100%]" key={_id}>
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
                  })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {ingredientsLoading && (
        <div className="w-full flex justify-center items-center">
          <Loader />
        </div>
      )}

      <div className="mt-10">
        <button
          type="submit"
          className={classNames(
            "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600",
            (ingredientsLoading ||
              generatePurchaseOrderLoading ||
              !ingredients) &&
              "opacity-50 cursor-not-allowed"
          )}
          onClick={generatePurchaseOrder}
          disabled={
            ingredientsLoading || generatePurchaseOrderLoading || !ingredients
          }
        >
          Generate Purchase order
        </button>
      </div>
    </div>
  );
};

export default WeeklyOrder;
