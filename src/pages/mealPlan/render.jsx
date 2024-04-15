import Selections from "@/components/mealPlan/render/Selections";
import axios from "axios";

const RenderMealPlanPage = () => {
  const [mealPlan, setMealPlan] = useState({});

  const fetchMealPlan = async ({ year, month, startDate, endDate }) => {
    const newStartDate = startDate.length === 1 ? `0${startDate}` : startDate;
    const newEndDate = endDate.length === 1 ? `0${endDate}` : endDate;
    const newMonth = month.length === 1 ? `0${month}` : month;
    const startDateFull = `${newStartDate}-${newMonth}-${year}`;
    const endDateFull = `${newEndDate}-${newMonth}-${year}`;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/mealPlan?startDate=${startDateFull}&endDate=${endDateFull}`
    );
    setMealPlan(res.data.data[0] || {});
  };

  return (
    <div>
      <Selections onSubmit={fetchMealPlan} />
    </div>
  );
};

export default RenderMealPlanPage;
