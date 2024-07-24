import { useState, useEffect } from "react";
import axios from "axios";
import Selections from "@/components/mealPlan/render/Selections";
import { format } from "date-fns";

const MonthlyOrder = () => {
  const [ingredients, setIngredients] = useState();
  const [showPurchaseOrder, setShowPurchaseOrder] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const fetchPurchaseOrder = async () => {
    try {
      const res = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/order/weekly-order?startDate=${format(
          startDate,
          "dd-MM-yyyy"
        )}&endDate=${format(endDate, "dd-MM-yyyy")}`
      );
      console.log({ res });
      setIngredients(res.data.data);
      setShowPurchaseOrder(true);
    } catch (e) {
      console.error(e);
    }
  };

  const generatePurchaseOrder = async () => {
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
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/generate-monthly-purchase-order`,
        {
          data: tableData,
        }
      );
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
      <h2 className="text-xl font-semibold mb-4">Weekly Order Generation</h2>
      <Selections
        onSubmit={fetchPurchaseOrder}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        buttonText={"Show purchase order"}
      />
      {showPurchaseOrder && (
        <>
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
                  <th className="border-r border-r-black py-2">
                    Current Stock
                  </th>
                  <th className="border-r border-r-black py-2">
                    Closing Stock (as on 31st)
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

          <div className="mt-10">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={generatePurchaseOrder}
            >
              Generate Purchase order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthlyOrder;
