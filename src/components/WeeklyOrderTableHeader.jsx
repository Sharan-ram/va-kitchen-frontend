import { format } from "date-fns";

const WeeklyOrderTableHeader = ({ startDate, endDate, dayBeforeStartDate }) => {
  return (
    <thead className="bg-gray-50 max-w-[100%] sticky top-[100px]">
      <tr className="bg-gray-200">
        <th className="px-3 py-2 font-bold uppercase tracking-wider">No.</th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Ingredient
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          {`Requirement (${format(startDate, "dd-MM-yyyy")} to
                      ${format(endDate, "dd-MM-yyyy")})`}
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          {`Requirement (Tmrw to
                      ${format(dayBeforeStartDate, "dd-MM-yyyy")})`}
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Current Stock (by end of today)
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          {`Closing Stock (Tmrw to ${format(
            dayBeforeStartDate,
            "dd-MM-yyyy"
          )})`}
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Bulk order
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Adjustment
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Purchase Unit
        </th>
      </tr>
    </thead>
  );
};

export default WeeklyOrderTableHeader;
