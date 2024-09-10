const MonthlyOrderTableHeader = () => {
  return (
    <thead className="bg-gray-50 max-w-[100%] sticky top-[100px]">
      <tr className="bg-gray-200">
        <th className="px-3 py-2 font-bold uppercase tracking-wider">No.</th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Ingredient
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Requirement (Next Month)
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Requirement (Tmrw to Month end)
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Current Stock (By end of today)
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Closing Stock (Tmrw to Month end)
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

export default MonthlyOrderTableHeader;
