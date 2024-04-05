import React from "react";

const RecipeSearchInput = ({ placeholder }) => {
  const handleInputChange = (e) => {
    // Handle input change logic here
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleInputChange}
        className="block w-full pl-10 pr-4 py-2 border rounded-md"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
    </div>
  );
};

export default RecipeSearchInput;
