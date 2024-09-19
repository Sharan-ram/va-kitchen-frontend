import { useEffect, useState } from "react";
import { searchIngredient } from "@/services/ingredient";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import Link from "next/link";
import IngredientFilters from "@/components/IngredientFilters";

const Ingredients = ({ ingredients }) => {
  // const [ingredients, setIngredients] = useState();
  const [ingredientsLoading, setIngredientsLoading] = useState(false);
  const [ingredientTypeFilter, setIngredientTypeFilter] = useState();
  const [vendorFilter, setVendorFilter] = useState();

  // useEffect(() => {
  //   const fetchIngredients = async () => {
  //     try {
  //       setIngredientsLoading(true);
  //       const response = await searchIngredient();
  //       setIngredients(response);
  //       setIngredientsLoading(false);
  //     } catch (e) {
  //       console.error(e);
  //       setIngredientsLoading(false);
  //       toast.error("Error fetching ingredients");
  //     }
  //   };

  //   fetchIngredients();
  // }, []);

  const getFilteredIngredients = () => {
    if (ingredientsLoading || !ingredients) return [];
    if (ingredientTypeFilter && vendorFilter) {
      return ingredients.filter(
        (ingredient) =>
          ingredient.ingredientType === ingredientTypeFilter &&
          ingredient.vendor === vendorFilter
      );
    }

    if (ingredientTypeFilter) {
      return ingredients.filter(
        (ingredient) => ingredient.ingredientType === ingredientTypeFilter
      );
    }

    if (vendorFilter) {
      return ingredients.filter(
        (ingredient) => ingredient.vendor === vendorFilter
      );
    }

    return ingredients;
  };

  const filteredIngredients = getFilteredIngredients();

  return !ingredients || ingredientsLoading ? (
    <div className="w-full flex justify-center items-center">
      <Loader />
    </div>
  ) : (
    <div className="">
      <div>
        <IngredientFilters
          ingredientTypeFilter={ingredientTypeFilter}
          setIngredientTypeFilter={setIngredientTypeFilter}
          vendorFilter={vendorFilter}
          setVendorFilter={setVendorFilter}
        />
      </div>
      <div className="mt-6">
        <table className="min-w-full divide-y divide-gray-200 max-w-[100%] mr-[40px]">
          <thead className="bg-gray-50 max-w-[100%] sticky top-[100px]">
            <tr className="bg-gray-200">
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                No.
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                English Equivalent
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Ingredient type
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Storage type
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Sponsored
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Purchase Unit
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Purchase Unit per Cooking Unit
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Cooking Unit
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Nuts
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Dairy
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Gluten
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Ingredient Specific Allergy
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Allergy Code
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Master Code
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Todo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 max-w-[100%]">
            {filteredIngredients.map((ingredient, index) => {
              const {
                name,
                englishEquivalent,
                ingredientType,
                storageType,
                vendor,
                sponsored,
                purchaseUnit,
                purchaseUnitPerCookingUnit,
                cookingUnit,
                nuts,
                dairy,
                gluten,
                ingredientSpecificAllergy,
                allergyCode,
                masterCode,
                todo,
                _id,
              } = ingredient;
              return (
                <tr key={_id}>
                  <td className="px-3 py-2 whitespace-nowrap capitalize">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden max-w-[300px] text-ellipsis font-bold ">
                    <Link
                      href={`/ingredients/${_id}`}
                      className="hover:text-[#8e7576]"
                    >
                      {name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden max-w-[300px] text-ellipsis">
                    {englishEquivalent}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize">
                    {ingredientType}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize">
                    {storageType}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize">
                    {vendor}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize">
                    {sponsored === true && "Yes"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize">
                    {purchaseUnit}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize">
                    {purchaseUnitPerCookingUnit}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize">
                    {cookingUnit}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize">
                    {nuts === true && "Yes"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize">
                    {dairy === true && "Yes"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize">
                    {gluten === true && "Yes"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize">
                    {ingredientSpecificAllergy}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize">
                    {allergyCode}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize">
                    {masterCode}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize">
                    {todo}
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

export async function getStaticProps() {
  const ingredients = await searchIngredient();

  return { props: { ingredients }, revalidate: 3600 };
}

export default Ingredients;
