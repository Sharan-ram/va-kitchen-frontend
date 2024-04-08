import React from "react";

const MealCountInput = ({ veganCount, nonVeganCount, glutenFreeCount }) => {
  const handleInputChange = (e) => {
    // Handle input change logic here
  };

  return (
    <div className="flex mt-2">
      <input
        type="number"
        placeholder="Vegan"
        onChange={handleInputChange}
        className="flex-1 mr-2 pl-2 py-1 border rounded-md"
        value={veganCount}
      />
      <input
        type="number"
        placeholder="Non-Vegan"
        onChange={handleInputChange}
        className="flex-1 mr-2 pl-2 py-1 border rounded-md"
        value={nonVeganCount}
      />
      <input
        type="number"
        placeholder="Gluten-Free"
        onChange={handleInputChange}
        className="flex-1 pl-2 py-1 border rounded-md"
        value={glutenFreeCount}
      />
    </div>
  );
};

export default MealCountInput;
