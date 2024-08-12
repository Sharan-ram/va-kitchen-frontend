import { useState, useEffect } from "react";
import {
  getMonthlyOrder,
  generateMonthlyPurchaseOrder,
} from "@/services/order";

const MonthlyOrder = () => {
  const [ingredients, setIngredients] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMonthlyOrder();
        setIngredients(res);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  const generatePurchaseOrder = async () => {
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
      }
    } catch (error) {
      console.error("Error generating purchase order:", error);
      // alert("Failed to generate purchase order.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Monthly Order Generation</h2>
      <div className="my-4">
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
                    <td className="border-r border-r-black p-4">{bulkOrder}</td>
                    <td className="border-r border-r-black p-4">
                      <input
                        type="text"
                        onChange={(e) => {
                          const updatedIngredients = ingredients.map((ing) => {
                            // console.log({ ingredient, ing });
                            if (ing._id === ingredient._id) {
                              return {
                                ...ingredient,
                                adjustment: e.target.value,
                              };
                            }
                            return ing;
                          });
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

      <div className="mt-10">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={generatePurchaseOrder}
        >
          Generate Purchase order
        </button>
      </div>
    </div>
  );
};

export default MonthlyOrder;
