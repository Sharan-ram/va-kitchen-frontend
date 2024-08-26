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
      [
        "Ingredient",
        "Requirement (Next Month)",
        "Requirement (Rest)",
        "Current Stock",
        "Closing Stock (as on 31st)",
        "Bulk order",
        "Adjustment",
        "Purchase Unit",
      ], // Headers
      ...ingredients.map(
        ({
          name,
          bulkOrder,
          monthlyMealPlan,
          remainingMealPlan,
          currentStock,
          adjustment,
          purchaseUnit,
          closingStock,
        }) => [
          name,
          monthlyMealPlan,
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
          <table className="mt-2 text-center border-2 border-black w-full">
            <thead className="border-b-2 border-b-black">
              <tr>
                <th className="border-r border-r-black py-2">Ingredient</th>
                <th className="border-r border-r-black py-2">
                  Requirement (Next Month)
                </th>
                <th className="border-r border-r-black py-2">
                  Requirement (Rest)
                </th>
                <th className="border-r border-r-black py-2">Current Stock</th>
                <th className="border-r border-r-black py-2">
                  Closing Stock (as on 31st)
                </th>
                <th className="border-r border-r-black py-2">Bulk order</th>
                <th className="border-r border-r-black py-2">Adjustment</th>
                <th className="border-r border-r-black py-2">Purchase Unit</th>
              </tr>
            </thead>
            <tbody>
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
                    <tr className="border border-black" key={_id}>
                      <td className="border-r border-r-black p-4">{name}</td>
                      <td className="border-r border-r-black p-4">
                        {monthlyMealPlan}
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
          Generate Purchase order
        </button>
      </div>
    </div>
  );
};

export default MonthlyOrder;
