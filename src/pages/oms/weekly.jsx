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
            <table className="mt-2 text-center border-2 border-black w-full">
              <thead className="border-b-2 border-b-black">
                <tr>
                  <th className="border-r border-r-black py-2">Ingredient</th>
                  <th className="border-r border-r-black py-2">
                    {`Requirement (${format(startDate, "dd-MM-yyyy")} to
                      ${format(endDate, "dd-MM-yyyy")})`}
                  </th>
                  <th className="border-r border-r-black py-2">
                    {`Requirement (${format(today, "dd-MM-yyyy")} to
                      ${format(dayBeforeStartDate, "dd-MM-yyyy")})`}
                  </th>
                  <th className="border-r border-r-black py-2">
                    Current Stock
                  </th>
                  <th className="border-r border-r-black py-2">
                    {`Closing Stock (as on ${format(
                      dayBeforeStartDate,
                      "dd-MM-yyyy"
                    )})`}
                  </th>
                  <th className="border-r border-r-black py-2">Bulk order</th>
                  <th className="border-r border-r-black py-2">Adjustment</th>
                  <th className="border-r border-r-black py-2">
                    Purchase Unit
                  </th>
                </tr>
              </thead>
              <tbody>
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
                      <tr className="border border-black" key={_id}>
                        <td className="border-r border-r-black p-4">{name}</td>
                        <td className="border-r border-r-black p-4">
                          {weeklyMealPlan}
                        </td>
                        <td className="border-r border-r-black p-4">
                          {remainingMealPlan}
                        </td>
                        <td className="border-r border-r-black p-4">
                          {currentStock}
                        </td>
                        <td className="border-r border-r-black p-4">
                          {closingStock}
                        </td>
                        <td className="border-r border-r-black p-4">
                          {bulkOrder}
                        </td>
                        <td className="border-r border-r-black p-4">
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
                        <td className="border-r border-r-black p-4">
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
