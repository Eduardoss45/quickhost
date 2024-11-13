import { CiSearch } from "react-icons/ci";

import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  // const handleInputChange = (event) => {
  //   onSearch(event.target.value);
  // };

  return (
    <div id="barra">
      <span>
        <CiSearch />
      </span>
      <nav id="search-bar">
        <span>Destino</span>
        <label>
          <input
            id="search-bar-input"
            type="text"
            placeholder="Localização"
            // onChange={handleInputChange}
          />
        </label>
      </nav>
    </div>
  );
};

export default SearchBar;
