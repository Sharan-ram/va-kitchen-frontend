import { useState } from "react";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";

const Selections = ({ onSubmit }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  return (
    <div className="flex items-center justify-start">
      <div>
        <label htmlFor="startDate">Start Date:</label>
        <DatePicker
          id="startDate"
          value={startDate}
          onChange={(date) => {
            setStartDate(date);
          }}
          format="dd-MM-yyyy"
        />
        <label htmlFor="endDate">End Date:</label>
        <DatePicker
          id="endDate"
          value={endDate}
          onChange={(date) => {
            setEndDate(date);
          }}
          format="dd-MM-yyyy"
        />
      </div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        disabled={!startDate || !endDate}
        onClick={() => onSubmit({ startDate, endDate })}
      >
        Show meal plan
      </button>
    </div>
  );
};

export default Selections;
