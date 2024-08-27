import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getRecipeById } from "@/services/recipe";
import { toast } from "react-toastify";

import Loader from "@/components/Loader";
import RecipeForm from "@/components/RecipeForm";

const EditRecipe = () => {
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipe, setRecipe] = useState();
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    if (query?.id) {
      const fetchRecipe = async () => {
        try {
          setRecipeLoading(true);
          const res = await getRecipeById(query.id);
          setRecipe(res);
          setRecipeLoading(false);
        } catch (e) {
          console.error(e);
          setRecipeLoading(false);
          toast.error("Error fetching recipe");
        }
      };

      fetchRecipe();
    }
  }, [query?.id]);

  console.log({ recipe });

  return !recipeLoading && recipe ? (
    // <RecipeForm recipe={recipe} type="edit" />
    <div>Update recipe page</div>
  ) : (
    <div className="w-full flex justify-center items-center">
      <Loader />
    </div>
  );
};

export default EditRecipe;
