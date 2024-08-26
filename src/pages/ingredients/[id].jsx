import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getIngredientById } from "@/services/ingredient";
import { toast } from "react-toastify";

import Loader from "@/components/Loader";

const EditIngredient = () => {
  const [ingredientLoading, setIngredientLoading] = useState(false);
  const [ingredient, setIngredient] = useState();
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    if (query?.id) {
      const fetchIngredient = async () => {
        try {
          setIngredientLoading(true);
          const res = await getIngredientById(query.id);
          setIngredient(res);
          setIngredientLoading(false);
        } catch (e) {
          console.error(e);
          setIngredientLoading(false);
          toast.error("Error fetching ingredient");
        }
      };

      fetchIngredient();
    }
  }, [query?.id]);

  console.log({ ingredient });

  return !ingredientLoading && ingredient ? (
    <div>This is ingredient edit page</div>
  ) : (
    <div className="w-full flex justify-center items-center">
      <Loader />
    </div>
  );
};

export default EditIngredient;
