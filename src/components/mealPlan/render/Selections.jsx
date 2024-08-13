import { useState } from "react";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";

const Selections = ({
  onSubmit,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  buttonText,
}) => {
  return (
    <div className="flex items-center justify-between w-1/2">
      <div>
        <div>
          <label className="font-bold" htmlFor="startDate">
            Start Date:
          </label>
        </div>
        <div>
          <DatePicker
            id="startDate"
            value={startDate}
            onChange={(date) => {
              setStartDate(date);
            }}
            format="dd-MM-yyyy"
          />
        </div>
      </div>
      <div>
        <div>
          <label className="font-bold" htmlFor="endDate">
            End Date:
          </label>
        </div>
        <div>
          <DatePicker
            id="endDate"
            value={endDate}
            onChange={(date) => {
              setEndDate(date);
            }}
            format="dd-MM-yyyy"
          />
        </div>
      </div>
      <div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={!startDate || !endDate}
          onClick={() => onSubmit({ startDate, endDate })}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Selections;
