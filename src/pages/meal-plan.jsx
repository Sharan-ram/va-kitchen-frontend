import { useState } from "react";

const Mealplan = () => {
  const [mealPlan] = useState(JSON.parse(localStorage.getItem("mealPlan")));
  const [veganCount] = useState(JSON.parse(localStorage.getItem("veganCount")));
  const [nonVeganCount] = useState(
    JSON.parse(localStorage.getItem("nonVeganCount"))
  );
  const [season] = useState(JSON.parse(localStorage.getItem("season")));

  console.log({ mealPlan, veganCount, nonVeganCount, season });
  return <div>Meal plan view page</div>;
};

export default Mealplan;
