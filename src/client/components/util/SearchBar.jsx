import React from "react";
import "../css/SearchBar.css";
export default props => {
  return (
    <div class="search-container">
      <input
        type="text"
        placeholder="Search..."
        className="search-text"
        value={props.query}
        onChange={props.onChange}
      />
      <div class="search-button">
        <i className="fas fa-search" />
      </div>
    </div>
  );
};
