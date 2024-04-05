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

  return (
    <div>
      <CreateForm
        showTable={(val) => setShowTable(val)}
        formData={formData}
        setFormData={setFormData}
      />
      {showTable && <Table year={formData.year} month={formData.month} />}
    </div>
  );
};

export default CreateMealPlanPage;
