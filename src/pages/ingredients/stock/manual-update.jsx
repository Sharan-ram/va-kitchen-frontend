import { useState, useEffect } from "react";
import {
  getIngredientStock,
  updateStock as updateStockToDB,
} from "@/services/ingredient";

const ManualStockUpdate = () => {
  const [ingredients, setIngredients] = useState();

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await getIngredientStock();
        setIngredients(res);
      } catch (e) {
        console.error(e);
      }
    };

    fetchIngredients();
  }, []);

  //   console.log({ ingredients });
  const updateStock = async () => {
    try {
      const newIngredients = ingredients.map((ing) => {
        return {
          ...ing,
          stock: Number(ing.stock),
        };
      });
      await updateStockToDB({
        ingredients: newIngredients,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manual Stock Update</h2>
      {ingredients &&
        ingredients.map((ingredient) => {
          return (
            <div key={ingredient._id} className="flex items-center w-1/2 my-4">
              <div className="w-1/2">
                <p>{ingredient.name}</p>
              </div>
              <div className="w-1/2 flex items-center">
                <div>
                  <input
                    type="text"
                    onChange={(e) => {
                      const updatedIngredients = ingredients.map((ing) => {
                        // console.log({ ingredient, ing });
                        if (ing._id === ingredient._id) {
                          return {
                            ...ingredient,
                            stock: e.target.value,
                          };
                        }
                        return ing;
                      });
                      setIngredients(updatedIngredients);
                    }}
                    value={ingredient.stock}
                    className="pl-10 pr-4 py-2 border rounded-md"
                  />
                </div>

                <div className="ml-2">
                  <p>{ingredient.purchaseUnit}</p>
                </div>
              </div>
            </div>
          );
        })}
      <div className="mt-10">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={updateStock}
        >
          Update Stock
        </button>
      </div>
    </div>
  );
};

export default ManualStockUpdate;
