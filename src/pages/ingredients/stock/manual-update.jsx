import axios from "axios";
import { useState, useEffect } from "react";

const ManualStockUpdate = () => {
  const [ingredients, setIngredients] = useState();

  useEffect(() => {
    const fetchIngredients = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingredient/stock-summary`
      );
      setIngredients(res.data.data);
    };

    fetchIngredients();
  }, []);

  console.log({ ingredients });

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
              <div className="w-1/2">
                <input
                  type="text"
                  onChange={(e) => {
                    const updatedIngredients = ingredients.map((ing) => {
                      if (ing._id === ingredient._id) {
                        return {
                          ...ingredient,
                          stock: e.target.value,
                        };
                      }
                      return ingredient;
                    });
                    setIngredients(updatedIngredients);
                  }}
                  value={ingredient.stock}
                  className="pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
            </div>
          );
        })}
      <div className="mt-10">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Update Stock
        </button>
      </div>
    </div>
  );
};

export default ManualStockUpdate;
