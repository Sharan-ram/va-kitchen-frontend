import { useState, useMemo } from "react";
import Input from "@/components/Input";
import { years, months } from "@/helpers/constants";
import { generateDaysOfMonth } from "@/helpers/utils";

const Selections = ({ onSubmit }) => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dates = useMemo(() => {
    if (!year || !month) return [];
    const dates = generateDaysOfMonth(year, Number(month - 1));
    console.log({ dates });
    return dates.map((day) => {
      const date = day.getDate();
      return {
        text: date,
        value: date,
      };
    });
  }, [month, year]);

  return (
    <div className="flex items-center justify-start">
      <Input
        type="select"
        selectProps={{
          selected: year,
          onChange: (e) => setYear(e.target.value),
          options: [{ value: "", text: "Select year" }, ...years],
        }}
        classes={{ wrapper: "w-1/4 mr-4" }}
      />

      <Input
        type="select"
        selectProps={{
          selected: month,
          onChange: (e) => setMonth(e.target.value),
          options: [{ value: "", text: "Select month" }, ...months],
        }}
        classes={{ wrapper: "w-1/4 mr-4" }}
      />

      <Input
        type="select"
        selectProps={{
          selected: startDate,
          onChange: (e) => setStartDate(e.target.value),
          options: [{ value: "", text: "Select start date" }, ...dates],
        }}
        classes={{ wrapper: "w-1/4 mr-4" }}
      />

      <Input
        type="select"
        selectProps={{
          selected: endDate,
          onChange: (e) => setEndDate(e.target.value),
          options: [{ value: "", text: "Select end date" }, ...dates],
        }}
        classes={{ wrapper: "w-1/4 mr-4" }}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        disabled={!year || !year || !startDate || !endDate}
        onClick={() => onSubmit({ year, month, startDate, endDate })}
      >
        Show meal plan
      </button>
    </div>
  );
};

export default Selections;
