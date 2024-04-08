import CreateForm from "@/components/mealPlan/CreateForm";
import { useState } from "react";
import Table from "@/components/mealPlan/Table";

const CreateMealPlanPage = () => {
  const [showTable, setShowTable] = useState(false);
  const [formData, setFormData] = useState({
    year: "",
    month: "",
    season: "",
    veganCount: 0,
    nonVeganCount: 0,
    glutenFreeCount: 0,
  });

  const [mealPlan, setMealPlan] = useState({});

  return (
    <div>
      <CreateForm
        showTable={(val) => setShowTable(val)}
        formData={formData}
        setFormData={setFormData}
      />
      {showTable && (
        <Table
          year={formData.year}
          month={formData.month}
          veganCount={formData.veganCount}
          nonVeganCount={formData.nonVeganCount}
          glutenFreeCount={formData.glutenFreeCount}
          mealPlan={mealPlan}
          setMealPlan={setMealPlan}
        />
      )}
      {showTable && (
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-5">
          Save Meal Plan
        </button>
      )}
    </div>
  );
};

export default CreateMealPlanPage;
