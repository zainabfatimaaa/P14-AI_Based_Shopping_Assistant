


import "./ProductFilters.css";
import React, { useState } from "react";

const uniqueColors = [
  "Black", "White", "Grey", "Beige", "Red", "Pink", "Orange", "Yellow",
  "Green", "Blue", "Purple", "Brown", "Multi-color", "Other"
];
const uniqueBrands = ["LAMA", "Outfitters"];
const uniqueSizes = [
  "S", "M", "L", "XL", "2XL", "XS", "3XL", "4XL",
  "30", "32", "34", "36", "38", "40",
  "28", "33", "24", "26", "S-M", "L-XL", "M-L", "XS-S"
];

function ProductFilters({
  colorFilters, setColorFilters,
  sizeFilters, setSizeFilters,
  brandFilters, setBrandFilters,
  priceSortOption, setPriceSortOption,
  alphabeticalSortOption, setAlphabeticalSortOption,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  resetFilters,
}) {

    const [expanded, setExpanded] = useState({
        color: false,
        size: false,
        brand: false,
        priceSort: false,
        alphaSort: false,
        priceRange: false,
      });
      

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (filterState, setFilterState, value) => {
    setFilterState((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleResetFilters = () => {
    setColorFilters([]);
    setSizeFilters([]);
    setBrandFilters([]);
    setPriceSortOption("");
    setAlphabeticalSortOption("");
    setMinPrice(0);
    setMaxPrice(50000);
    setSearchTerm("");
    setSubmittedSearchTerm("");
    setCurrentPage(1);
  };

  const renderSection = (title, sectionKey, children) => (
    <div className="filter-section">
      <div className="filter-section-header" onClick={() => toggleSection(sectionKey)}>
        <span>{title}</span>
        <span className={`arrow ${expanded[sectionKey] ? "open" : ""}`}>▼</span>
      </div>
      {expanded[sectionKey] && <div className="filter-options">{children}</div>}
    </div>
  );

  return (
    <div className="filters-panel">
      <div className="padding" />
      <div className="logo">
        <h3>Filters</h3>
      </div>

      {renderSection("Sort by Price", "priceSort", (
        <>
          <label><input type="checkbox" checked={priceSortOption === "price-asc"} onChange={() => setPriceSortOption(priceSortOption === "price-asc" ? "" : "price-asc")} /> Low to High</label>
          <label><input type="checkbox" checked={priceSortOption === "price-desc"} onChange={() => setPriceSortOption(priceSortOption === "price-desc" ? "" : "price-desc")} /> High to Low</label>
        </>
      ))}

      {renderSection("Alphabetical", "alphaSort", (
        <>
          <label><input type="checkbox" checked={alphabeticalSortOption === "A-Z"} onChange={() => setAlphabeticalSortOption(alphabeticalSortOption === "A-Z" ? "" : "A-Z")} /> A-Z</label>
          <label><input type="checkbox" checked={alphabeticalSortOption === "Z-A"} onChange={() => setAlphabeticalSortOption(alphabeticalSortOption === "Z-A" ? "" : "Z-A")} /> Z-A</label>
        </>
      ))}

      {renderSection("Price Range", "priceRange", (
        <>
          <input type="range" min="0" max="50000" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} />
          <input type="range" min="0" max="50000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
          <p>Rs. {minPrice} - Rs. {maxPrice}</p>
        </>
      ))}

      {renderSection("Colors", "color", (
        uniqueColors.map(color => (
          <label key={color}>
            <input
              type="checkbox"
              checked={colorFilters.includes(color)}
              onChange={() => handleCheckboxChange(colorFilters, setColorFilters, color)}
            />
            {color}
          </label>
        ))
      ))}

      {renderSection("Sizes", "size", (
        uniqueSizes.map(size => (
          <label key={size}>
            <input
              type="checkbox"
              checked={sizeFilters.includes(size)}
              onChange={() => handleCheckboxChange(sizeFilters, setSizeFilters, size)}
            />
            {size}
          </label>
        ))
      ))}

      {renderSection("Brands", "brand", (
        uniqueBrands.map(brand => (
          <label key={brand}>
            <input
              type="checkbox"
              checked={brandFilters.includes(brand)}
              onChange={() => handleCheckboxChange(brandFilters, setBrandFilters, brand)}
            />
            {brand}
          </label>
        ))
      ))}

      <button onClick={handleResetFilters} className="reset-button">Clear All</button>
    </div>
  );
}

export default ProductFilters;
