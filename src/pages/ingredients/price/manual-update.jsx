import { useState, useEffect } from "react";
import { getIngredientPrices, updatePrices } from "@/services/ingredient";

import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import classNames from "classnames";

const ManualPriceUpdate = () => {
  const [ingredients, setIngredients] = useState();
  const [pricesLoading, setPricesLoading] = useState(false);
  const [updatePricesLoading, setUpdatePricesLoading] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setPricesLoading(true);
        const res = await getIngredientPrices();
        const ingredientObj = {};
        res.forEach((ing) => {
          ingredientObj[ing._id] = ing;
        });
        setIngredients(ingredientObj);
        setPricesLoading(false);
      } catch (e) {
        console.error(e);
        setPricesLoading(false);
        toast.error("Error fetching prices!");
      }
    };

    fetchIngredients();
  }, []);

  //   console.log({ ingredients });
  const updatePrice = async () => {
    try {
      setUpdatePricesLoading(true);
      const newIngredients = Object.keys(ingredients).map((ingredientId) => {
        return {
          ...ingredients[ingredientId],
          price: Number(ingredients[ingredientId].price),
        };
      });
      await updatePrices({
        ingredients: newIngredients,
      });
      setUpdatePricesLoading(false);
      toast.success("Prices updated successfully!");
    } catch (e) {
      console.error(e);
      setUpdatePricesLoading(false);
      toast.error("Error updating prices!");
    }
  };

  const disableUpdateButton =
    pricesLoading || updatePricesLoading || !ingredients;

  return (
    <div>
      <div className="w-1/2 flex justify-between items-center">
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-4">Manual Price Update</h2>
        </div>
        <div className="w-1/2">
          <button
            type="submit"
            className={classNames(
              "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600",
              disableUpdateButton && "cursor-not-allowed opacity-50"
            )}
            onClick={updatePrice}
            disabled={disableUpdateButton}
          >
            {updatePricesLoading ? <Loader /> : "Update Price"}
          </button>
        </div>
      </div>
      <div className="mt-10">
        {ingredients && !pricesLoading ? (
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
                            price: e.target.value,
                          },
                        });
                      }}
                      value={ingredient.price}
                      className="pl-10 pr-4 py-2 border rounded-md"
                    />
                  </div>

                  <div className="ml-2">
                    <p>INR / {ingredient.purchaseUnit}</p>
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
          onClick={updatePrice}
          disabled={disableUpdateButton}
        >
          {updatePricesLoading ? <Loader /> : "Update Price"}
        </button>
      </div>
    </div>
  );
};

export default ManualPriceUpdate;
