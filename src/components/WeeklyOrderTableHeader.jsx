import { format } from "date-fns";

const WeeklyOrderTableHeader = ({
  startDate,
  endDate,
  startDateDeduction,
  endDateDeduction,
}) => {
  return (
    <thead className="bg-gray-50 max-w-[100%] sticky top-[100px]">
      <tr className="bg-gray-200">
        <th className="px-3 py-2 font-bold uppercase tracking-wider">No.</th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Ingredient
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          {`Requirement (${format(startDateDeduction, "dd-MM-yyyy")} to
                      ${format(endDateDeduction, "dd-MM-yyyy")})`}
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          {`Requirement (${format(startDate, "dd-MM-yyyy")} to
                      ${format(endDate, "dd-MM-yyyy")})`}
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Current Stock
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          {`Closing Stock (on ${format(endDateDeduction, "dd-MM-yyyy")})`}
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Bulk order
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Adjustment
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">Price</th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Purchase Unit
        </th>
      </tr>
    </thead>
  );
};

export default WeeklyOrderTableHeader;
