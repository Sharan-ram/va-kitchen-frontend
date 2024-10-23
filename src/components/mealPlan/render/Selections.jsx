import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";
import classNames from "classnames";
import Loader from "@/components/Loader";
import { seasons } from "@/helpers/constants";
import Input from "@/components/Input";

const Selections = ({
  onSubmit,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  buttonText,
  mealPlanLoading,
  toggleMealPlan,
  showButton = true,
  startDateLabel = "Start Date:",
  endDateLabel = "End Date:",
  showSeason = false,
  season = "",
  setSeason = () => {},
}) => {
  const disabled = !startDate || !endDate || mealPlanLoading;
  return (
    <div className="flex items-center justify-between w-1/2">
      <div>
        <div>
          <label className="font-bold" htmlFor="startDate">
            {startDateLabel}
          </label>
        </div>
        <div>
          <DatePicker
            id="startDate"
            value={startDate}
            onChange={(date) => {
              setStartDate(date);
              toggleMealPlan(false);
            }}
            format="dd-MM-yyyy"
          />
        </div>
      </div>
      <div>
        <div>
          <label className="font-bold" htmlFor="endDate">
            {endDateLabel}
          </label>
        </div>
        <div>
          <DatePicker
            id="endDate"
            value={endDate}
            onChange={(date) => {
              setEndDate(date);
              toggleMealPlan(false);
            }}
            format="dd-MM-yyyy"
          />
        </div>
      </div>

      {showSeason && (
        <div>
          <Input
            type="select"
            key={season}
            selectProps={{
              selected: season,
              onChange: (e) => {
                setSeason(e.target.value);
              },
              options: [{ value: "", text: "Select season" }, ...seasons],
              // value: season,
            }}
          />
        </div>
      )}
      <div>
        {showButton && (
          <button
            className={classNames(
              "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
            onClick={() => onSubmit({ startDate, endDate })}
          >
            {mealPlanLoading ? <Loader /> : buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Selections;
