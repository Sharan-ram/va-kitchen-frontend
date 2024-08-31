import { useState, useEffect } from "react";
import { getIngredientBulkOrder, updateBulkOrder } from "@/services/ingredient";

import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import classNames from "classnames";

const ManualBulkOrderUpdate = () => {
  const [ingredients, setIngredients] = useState();
  const [bulkOrderLoading, setBulkOrderLoading] = useState(false);
  const [updateBulkOrderLoading, setUpdateBulkOrderLoading] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setBulkOrderLoading(true);
        const res = await getIngredientBulkOrder();
        setIngredients(res);
        setBulkOrderLoading(false);
      } catch (e) {
        console.error(e);
        setBulkOrderLoading(false);
        toast.error("Error fetching bulk order!");
      }
    };

    fetchIngredients();
  }, []);

  //   console.log({ ingredients });
  const handleSubmit = async () => {
    try {
      setUpdateBulkOrderLoading(true);
      const newIngredients = ingredients.map((ing) => {
        return {
          ...ing,
          bulkOrder: Number(ing.bulkOrder),
        };
      });
      await updateBulkOrder({
        ingredients: newIngredients,
      });
      setUpdateBulkOrderLoading(false);
      toast.success("Prices updated successfully!");
    } catch (e) {
      console.error(e);
      setUpdateBulkOrderLoading(false);
      toast.error("Error updating prices!");
    }
  };

  const disableUpdateButton =
    bulkOrderLoading || updateBulkOrderLoading || !ingredients;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manual Bulk Order Update</h2>
      {ingredients && !bulkOrderLoading ? (
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
                            bulkOrder: e.target.value,
                          };
                        }
                        return ing;
                      });
                      setIngredients(updatedIngredients);
                    }}
                    value={ingredient.bulkOrder}
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
      <div className="mt-10">
        <button
          type="submit"
          className={classNames(
            "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600",
            disableUpdateButton && "cursor-not-allowed opacity-50"
          )}
          onClick={handleSubmit}
          disabled={disableUpdateButton}
        >
          Update Price
        </button>
      </div>
    </div>
  );
};

export default ManualBulkOrderUpdate;
