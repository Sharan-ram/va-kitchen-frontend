import { useState, useEffect } from "react";
import {
  getIngredientStock,
  updateStock as updateStockToDB,
} from "@/services/ingredient";

import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import classNames from "classnames";

const ManualStockUpdate = () => {
  const [ingredients, setIngredients] = useState();
  const [stockLoading, setStockLoading] = useState(false);
  const [updateStockLoading, setUpdateStockLoading] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setStockLoading(true);
        const res = await getIngredientStock();
        const ingredientObj = {};
        res.forEach((ing) => {
          ingredientObj[ing._id] = ing;
        });
        setIngredients(ingredientObj);
        setStockLoading(false);
      } catch (e) {
        console.error(e);
        setStockLoading(false);
        toast.error("Error fetching stock!");
      }
    };

    fetchIngredients();
  }, []);

  //   console.log({ ingredients });
  const updateStock = async () => {
    try {
      setUpdateStockLoading(true);
      const newIngredients = Object.keys(ingredients).map((ingredientId) => {
        return {
          ...ingredients[ingredientId],
          stock: Number(ingredients[ingredientId].stock),
        };
      });
      await updateStockToDB({
        ingredients: newIngredients,
      });
      setUpdateStockLoading(false);
      toast.success("Stock updated successfully!");
    } catch (e) {
      console.error(e);
      setUpdateStockLoading(false);
      toast.error("Error updating stock!");
    }
  };

  const disableUpdateButton =
    stockLoading || updateStockLoading || !ingredients;

  return (
    <div>
      <div className="flex items-center justify-between w-1/2">
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-4">Manual Stock Update</h2>
        </div>
        <div className="w-1/2">
          <button
            type="submit"
            className={classNames(
              "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600",
              disableUpdateButton && "cursor-not-allowed opacity-50"
            )}
            disabled={disableUpdateButton}
            onClick={updateStock}
          >
            {updateStockLoading ? <Loader /> : "Update Stock"}
          </button>
        </div>
      </div>
      <div className="mt-10">
        {ingredients && !stockLoading ? (
          Object.keys(ingredients).map((ingredientId) => {
            const ingredient = ingredients[ingredientId];
            return (
              <div
                key={ingredient._id}
                className="flex items-center w-1/2 my-4"
              >
                <div className="w-1/2">
                  <p className="font-semibold">{ingredient.name}</p>
                </div>
                <div className="w-1/2 flex items-center">
                  <div>
                    <input
                      type="text"
                      onChange={(e) => {
                        setIngredients({
                          ...ingredients,
                          [ingredientId]: {
                            ...ingredients[ingredientId],
                            stock: e.target.value,
                          },
                        });
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
          })
        ) : (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        )}
      </div>
      <div className="mt-10">
        <button
          type="submit"
          className={classNames(
            "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600",
            disableUpdateButton && "cursor-not-allowed opacity-50"
          )}
          disabled={disableUpdateButton}
          onClick={updateStock}
        >
          {updateStockLoading ? <Loader /> : "Update Stock"}
        </button>
      </div>
    </div>
  );
};

export default ManualStockUpdate;
