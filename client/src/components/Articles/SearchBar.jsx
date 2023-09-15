import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch, FaFilter } from "react-icons/fa";
import FilterModal from "./FilterModal";
import styles from "./SearchBar.module.css";

const SearchBar = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [textFilter, setTextFilter] = useState(searchParams.get("text") || "");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = props.token;
  useEffect(() => {
    const currentText = searchParams.get("text");
    if (currentText !== textFilter) {
      setTextFilter(currentText || "");
    }
  }, [searchParams]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setTextFilter(newText);
    searchParams.set("text", newText);
    setSearchParams(searchParams);
  };


  const submitHandler = (e) => {
    e && e.preventDefault();
    if (props.isPending) return;
    props.onFiltersSubmit();
  };

  const closeModal = () =>{
    setIsModalOpen(false);
  }
  return (
    <div className={styles.wrapper}>
      <form onSubmit={submitHandler} className={styles.searchContainer}>
        {props.isPending && <div className={styles.overlay}></div>}
        <input
          type="text"
          value={textFilter}
          onChange={handleTextChange}
          placeholder="Search"
          className={styles.searchInput}
          disabled={props.isPending}
        />
        <div className={styles.icons}>
          <FaSearch className={styles.icon} onClick={submitHandler} />
          <FaFilter
            onClick={() => !props.isPending && setIsModalOpen(true)}
            className={styles.icon}
          />
        </div>
      </form>

      {token && (
        <div className={`${styles.searchContainer} ${styles.new}`}>
          <Link to="/articles/new" className={styles.searchInput}>
            Create new article
          </Link>
        </div>
      )}

      {isModalOpen && (
        <FilterModal
          isOpen={isModalOpen}
          onClose={closeModal}
          
        />
      )}
    </div>
  );
};

export default SearchBar;
