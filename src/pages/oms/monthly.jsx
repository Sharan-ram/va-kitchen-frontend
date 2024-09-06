import { useState, useEffect } from "react";
import {
  getMonthlyOrder,
  generateMonthlyPurchaseOrder,
} from "@/services/order";

import { getCurrentMonth, getNextMonth } from "@/helpers/utils";
import Loader from "@/components/Loader";

import { toast } from "react-toastify";
import classNames from "classnames";

const MonthlyOrder = () => {
  const [ingredients, setIngredients] = useState();
  const [loading, setLoading] = useState(false);
  const [generateOrderInProgress, setGenerateOrder] = useState(false);

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

  const generatePurchaseOrder = async () => {
    setGenerateOrder(true);
    const tableData = [
      ["Ingredient", "Quantity", "Purchase Unit"], // Headers
      ...ingredients
        .filter((ingredient) => ingredient.adjustment > 0)
        .map(({ name, adjustment, purchaseUnit }) => [
          name,
          adjustment,
          purchaseUnit,
        ]),
    ];

    try {
      const res = await generateMonthlyPurchaseOrder(tableData);
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Current Month - {currentMonth}, Monthly Order Generation for -{" "}
        {nextMonth}
      </h2>
      <div className="my-4">
        {ingredients ? (
          <table className="min-w-full divide-y divide-gray-200 max-w-[100%]">
            <thead className="bg-gray-50 max-w-[100%] sticky top-[100px]">
              <tr className="bg-gray-200">
                <th className="px-3 py-2 font-bold uppercase tracking-wider">
                  No.
                </th>
                <th className="px-3 py-2 font-bold uppercase tracking-wider">
                  Ingredient
                </th>
                <th className="px-3 py-2 font-bold uppercase tracking-wider">
                  Requirement (Next Month)
                </th>
                <th className="px-3 py-2 font-bold uppercase tracking-wider">
                  Requirement (Tmrw to Month end)
                </th>
                <th className="px-3 py-2 font-bold uppercase tracking-wider">
                  Current Stock (By end of today)
                </th>
                <th className="px-3 py-2 font-bold uppercase tracking-wider">
                  Closing Stock (Tmrw to Month end)
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
                      <td className="px-3 py-2 whitespace-nowrap font-bold">
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
                })}
            </tbody>
          </table>
        ) : (
          <div className="w-full text-center flex justify-center items-center">
            <Loader />
          </div>
        )}
      </div>

      <div className="mt-10">
        <button
          type="submit"
          className={classNames(
            "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600",
            (loading || generateOrderInProgress || !ingredients) &&
              "cursor-not-allowed opacity-50"
          )}
          onClick={generatePurchaseOrder}
          disabled={loading || generateOrderInProgress || !ingredients}
        >
          {generateOrderInProgress ? <Loader /> : "Generate Purchase order"}
        </button>
      </div>
    </div>
  );
};

export default MonthlyOrder;
