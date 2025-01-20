import { useEffect, useState } from "react";
import { searchRecipe } from "@/services/recipe";
import { generateGoogleSheet } from "@/services/order";
import Link from "next/link";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import classNames from "classnames";
import { FixedSizeList as List } from "react-window";

const Recipes = ({ recipes }) => {
  // const [recipes, setRecipes] = useState();
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [exportInProgress, setExportInProgress] = useState(false);

  // const [viewportHeight, setViewportHeight] = useState();
  // const [viewportWidth, setViewportWidth] = useState();
  // const [itemSize, setItemSize] = useState();
  // const [isMounted, setIsMounted] = useState(false);

  // useEffect(() => {
  //   setIsMounted(true);
  //   const handleResize = () => {
  //     setViewportHeight(window.innerHeight);
  //     setViewportWidth(window.innerWidth);

  //     // Adjust item size based on viewport width or other criteria
  //     if (window.innerWidth > 1200) {
  //       setItemSize(80);
  //     } else {
  //       setItemSize(60);
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);
  //   handleResize(); // Call on mount to set initial sizes

  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  const getRows = () => {
    if (recipesLoading || !recipes) return [];
    const rows = [];
    recipes.forEach((recipe, recipeIndex) => {
      recipe.ingredients.forEach((ingredient, index) => {
        const { _id, name, dietType } = recipe;

        const {
          summerQuantity,
          winterQuantity,
          monsoonQuantity,
          retreatQuantity,
        } = ingredient;

        rows.push({
          num: index === 0 ? recipeIndex + 1 : "",
          _id: index === 0 ? _id : "",
          name: index === 0 ? name : "",
          dietType: index === 0 ? dietType : [],
          summerQuantity,
          winterQuantity,
          monsoonQuantity,
          retreatQuantity,
          ingredientName: ingredient.name,
        });
      });
    });

    return rows;
  };

  const rows = getRows();

  // console.log({ rows: rows.slice(0, 100) });

  const exportToGSheet = async () => {
    setExportInProgress(true);
    const tableData = [
      [
        "No.",
        "Recipe",
        "Ingredient",
        "Summer Quantity",
        "Winter Quantity",
        "Monsson Quantity",
        "Retreat Quantity",
        "Usual Meal Time",
        "Type of Meal",
        "Diet Type",
        "Indian Label",
        "English Label",
        "Vessels",
        "Utensils",
      ],
      ...rows.map(
        ({
          num,
          name,
          ingredientName,
          summerQuantity,
          winterQuantity,
          monsoonQuantity,
          retreatQuantity,
          dietType,
        }) => [
          num,
          name,
          ingredientName,
          summerQuantity,
          winterQuantity,
          monsoonQuantity,
          retreatQuantity,
          dietType?.map(
            (str, index) => `${str}${index !== dietType.length - 1 ? "," : ""} `
          ),
        ]
      ),
    ];

    try {
      await generateGoogleSheet({
        payload: tableData,
        title: `Recipes Databse`,
      });
      toast.success("Export successful!");
    } catch (error) {
      console.error("Export exporting!", error);
      setExportInProgress(false);
      toast.error("Error exporting!");
    }
  };

  // Virtualization Row component
  // const Row = ({ index, style }) => {
  //   const {
  //     _id,
  //     num,
  //     name,
  //     dietType,
  //     summerQuantity,
  //     winterQuantity,
  //     monsoonQuantity,
  //     retreatQuantity,
  //     ingredientName,
  //   } = rows[index];

  //   return (
  //     <div style={style} className="tr">
  //       <td className="px-3 py-2 whitespace-nowrap capitalize">{num}</td>
  //       <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden max-w-[300px] text-ellipsis font-bold">
  //         <Link href={`/recipes/${_id}`} className="hover:text-[#8e7576]">
  //           {name}
  //         </Link>
  //       </td>
  //       <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
  //         {ingredientName}
  //       </td>
  //       <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
  //         {summerQuantity}
  //       </td>
  //       <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
  //         {monsoonQuantity}
  //       </td>
  //       <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
  //         {winterQuantity}
  //       </td>
  //       <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
  //         {retreatQuantity}
  //       </td>
  //       <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
  //         {dietType &&
  //           dietType.map((str, index) => {
  //             let text = str;
  //             if (str === "nonVegan") {
  //               text = "Non Vegan";
  //             } else if (str === "glutenFree") {
  //               text = "Gluten Free";
  //             }
  //             return (
  //               <p key={str}>{`${text}${
  //                 index !== dietType.length - 1 ? "," : ""
  //               } `}</p>
  //             );
  //           })}
  //       </td>
  //     </div>
  //   );
  // };

  return !recipes || recipesLoading ? (
    <div className="w-full flex justify-center items-center">
      <Loader />
    </div>
  ) : (
    <div className="">
      <button
        type="submit"
        className={classNames(
          "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600",
          recipesLoading ||
            (exportInProgress && "cursor-not-allowed opacity-50")
        )}
        onClick={() => exportToGSheet()}
        disabled={recipesLoading || exportInProgress || !recipes}
      >
        Export to Google Sheets
      </button>
      <table className="min-w-full divide-y divide-gray-200 max-w-[100%] mr-[40px] mt-6">
        <thead className="bg-gray-50 max-w-[100%] sticky top-[100px]">
          <tr className="bg-gray-200">
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              No.
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Name
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Ingredient Name
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Summer Quantity
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Monsoon Quantity
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Winter Quantity
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Retreat Quantity
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider text-center">
              Diet Type
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 max-w-[100%]">
          {/* <List
              height={viewportHeight} // Use dynamic height
              itemCount={rows.length} // Total rows to render
              itemSize={itemSize} // Use dynamic item size
              width={viewportWidth} // Use dynamic width
            >
              {Row}
            </List> */}
          {rows.map((recipe, index) => {
            const {
              _id,
              num,
              name,
              dietType,
              summerQuantity,
              winterQuantity,
              monsoonQuantity,
              retreatQuantity,
              ingredientName,
            } = recipe;
            return (
              <tr key={index}>
                <td className="px-3 py-2 whitespace-nowrap capitalize">
                  {num}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden max-w-[300px] text-ellipsis font-bold">
                  <Link
                    href={`/recipes/${_id}`}
                    className="hover:text-[#8e7576]"
                  >
                    {name}
                  </Link>
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {ingredientName}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {summerQuantity}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {monsoonQuantity}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {winterQuantity}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {retreatQuantity}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {dietType &&
                    dietType.map((str, index) => {
                      let text = str;
                      if (str === "nonVegan") {
                        text = "Non Vegan";
                      } else if (str === "glutenFree") {
                        text = "Gluten Free";
                      }
                      return (
                        <p key={str}>{`${text}${
                          index !== dietType.length - 1 ? "," : ""
                        } `}</p>
                      );
                    })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export async function getServerSideProps() {
  const recipes = await searchRecipe();

  return {
    props: { recipes },
    // revalidate: 3600,
  };
}

export default Recipes;
