import { useState, useEffect } from "react";
import axios from "axios";

const MonthlyOrder = () => {
  const [ingredients, setIngredients] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/monthly-order`
      );
      console.log({ res });
      setIngredients(res.data.data);
    };

    fetchData();
  }, []);
  console.log({ ingredients });
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
    </div>
  );
};

export default MonthlyOrder;
