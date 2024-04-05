import React from "react";
import { useState } from "react";
import axios from "axios";

const RecipeSearchInput = ({ placeholder }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  let debounceTimer;

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    try {
      if (value.length >= 3) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/recipe?search=${value}`
          );
          setSearchResults(res.data.data);
          setShowSearchResults(true);
        }, 300);
      }
    } catch (e) {
      console.error(e);
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSelectRecipe = () => {};

  return (
    <div className="relative">
      <div>
        <input
          type="text"
          placeholder={placeholder}
          onChange={handleInputChange}
          className="block w-full pl-10 pr-4 py-2 border rounded-md"
        />
      </div>

      {showSearchResults && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md z-[99999]">
          {searchResults.map((result, i) => {
            return (
              <div
                key={i}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectRecipe(result, index)}
              >
                {result.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecipeSearchInput;
