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
        setIngredients(res);
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
      const newIngredients = ingredients.map((ing) => {
        return {
          ...ing,
          price: Number(ing.price),
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
      <h2 className="text-xl font-semibold mb-4">Manual Price Update</h2>
      {ingredients && !pricesLoading ? (
        ingredients.map((ingredient) => {
          return (
            <div key={ingredient._id} className="flex items-center w-1/2 my-4">
              <div className="w-1/2">
                <p className="font-semibold">{ingredient.name}</p>
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
                            price: e.target.value,
                          };
                        }
                        return ing;
                      });
                      setIngredients(updatedIngredients);
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
          Update Price
        </button>
      </div>
    </div>
  );
};

export default ManualPriceUpdate;
