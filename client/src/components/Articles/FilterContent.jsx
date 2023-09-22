import React,{useState} from "react";
import classes from "./FilterContent.module.css";

import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../../utils/http";

const FilterContent = ({ filters, setFilters }) => {
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => fetchCategories({ signal }),
  });
  
  const handleDropdownClick = () => {
    setIsDropdownExpanded(!isDropdownExpanded);
  };

  return (
    <div className={classes.container}>
      <div className={classes.group}>
        <input
          name="authorName"
          placeholder="Enter author name"
          value={filters.authorName || ""}
          onChange={handleChange}
        />
        <input
          name="authorSurname"
          placeholder="Enter author surname"
          value={filters.authorSurname || ""}
          onChange={handleChange}
        />
      </div>

      <div className={classes.dateRange}>
        <div className={classes.dateItem}>
          <label htmlFor="dateFrom" className={classes.label}>
            From
          </label>
          <input
            id="dateFrom"
            type="date"
            name="dateFrom"
            value={filters.dateFrom || ""}
            onChange={handleChange}
          />
        </div>
        <div className={classes.dateItem}>
          <label htmlFor="dateTo" className={classes.label}>
            To
          </label>
          <input
            id="dateTo"
            type="date"
            name="dateTo"
            value={filters.dateTo || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={classes.Item}>
        <label className={classes.label} htmlFor="rating">
          Rating
        </label>
        <input
          id="rating"
          type="number"
          name="rating"
          min="0"
          max="5"
          step="0.5"
          placeholder="0 to 5 (0.5 steps)"
          value={filters.rating || ""}
          className={classes.ratingInput}
          onChange={handleChange}
          onInvalid={(e) => {
            e.target.setCustomValidity("");
            if (e.target.validity.valueMissing) {
              e.target.setCustomValidity("Please provide a rating.");
            } else if (
              e.target.validity.rangeOverflow ||
              e.target.validity.rangeUnderflow ||
              e.target.validity.stepMismatch
            ) {
              e.target.setCustomValidity(
                "Rating should be between 0 and 5, with 0.5 steps."
              );
            }
          }}
          onInput={(e) => e.target.setCustomValidity("")}
        />
      </div>

      <div className={classes.Item}>
        <label htmlFor="sort" className={classes.label}>
          Sort
        </label>
        <select
          name="sort"
          id="sort"
          value={filters.sort || ""}
          onChange={handleChange}
          className={classes.sortDropdown}
        >
          <option value="" disabled>
            None
          </option>
          <option value="date">Date</option>
          <option value="reviews">Popularity</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div className={classes.Item}>
        <label htmlFor="order" className={classes.label}>
          Order
        </label>
        <select
          name="order"
          id="order"
          disabled={!filters.sort}
          value={filters.order || ""}
          onChange={handleChange}
          className={classes.dropdown}
        >
          <option value="" disabled>
            None
          </option>
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </div>
      <div className={classes.Item}>
        <label htmlFor="category" className={classes.label}>
          Category
        </label>
        <select
          name="category"
          id="category"
          value={filters.category || ""}
          onChange={handleChange}
          onClick={handleDropdownClick}
          size={isDropdownExpanded ? "5" : "1"}
          className={classes.dropdown}
        >
          <option value="">All</option>
          {categories &&
            categories.map((category, idx) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default FilterContent;
