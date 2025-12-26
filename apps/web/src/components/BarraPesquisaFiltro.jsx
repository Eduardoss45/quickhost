import React, { useState, useEffect, useRef } from "react";
import { CiFilter } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import { HiChevronDown } from "react-icons/hi2";
import "./BarraPesquisaFiltro.css";

const BarraPesquisaFiltro = ({ onSearch, onFilterClick, onSort }) => {
  const [openTipoHospedagem, setOpenTipoHospedagem] = useState(false);
  const [openOrdenarPor, setOpenOrdenarPor] = useState(false);
  const [tipoHospedagem, setTipoHospedagem] = useState("Tipo de Hospedagem");
  const [ordenarPor, setOrdenarPor] = useState("Ordenar por");

  const categoryMapping = {
    Pousada: "inn",
    Chalé: "chalet",
    Apartamento: "apartment",
    Casa: "home",
    Quarto: "room",
    Todos: "",
  };

  const orderMapping = {
    Avaliação: "rating",
    "Mais recentes": "newest",
    "Mais antigos": "oldest",
    Todos: "",
  };

  const dropdownRef = useRef(null);

  const handleTipoHospedagemClick = (tipo) => {
    setTipoHospedagem(tipo);
    setOpenTipoHospedagem(false);
    onFilterClick(categoryMapping[tipo] || "");
  };

  const handleOrdenarPorClick = (ordenacao) => {
    setOrdenarPor(ordenacao);
    setOpenOrdenarPor(false);
    onSort(orderMapping[ordenacao] || "");
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    onSearch(searchTerm);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenTipoHospedagem(false);
        setOpenOrdenarPor(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderDropdownMenu = (options, handleClick, currentOption) => {
    return (
      <div className={`dropdown-menu ${openTipoHospedagem ? "open" : ""}`}>
        {options.map((option) => (
          <div
            key={option}
            onClick={() => handleClick(option)}
            className={currentOption === option ? "selected" : ""}
          >
            {option}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="search-bar" ref={dropdownRef}>
      <IoSearchOutline className="search-icon" />
      <div className="search-input">
        <input
          type="text"
          placeholder="Digite o nome da localidade..."
          onChange={handleSearchChange}
        />
      </div>
      <CiFilter className="filter-icon" />
      <div className="dropdown">
        <button
          onClick={() => setOpenTipoHospedagem(!openTipoHospedagem)}
          className={`dropdown-button ${openTipoHospedagem ? "open" : ""}`}
          aria-expanded={openTipoHospedagem}
          aria-haspopup="listbox"
        >
          {tipoHospedagem}
          <HiChevronDown />
        </button>
        {openTipoHospedagem &&
          renderDropdownMenu(
            Object.keys(categoryMapping),
            handleTipoHospedagemClick,
            tipoHospedagem
          )}
      </div>
      <div className="dropdown">
        <button
          onClick={() => setOpenOrdenarPor(!openOrdenarPor)}
          className={`dropdown-button ${openOrdenarPor ? "open" : ""}`}
          aria-expanded={openOrdenarPor}
          aria-haspopup="listbox"
        >
          {ordenarPor}
          <HiChevronDown />
        </button>
        {openOrdenarPor &&
          renderDropdownMenu(
            ["Avaliação", "Mais recentes", "Mais antigos", "Todos"],
            handleOrdenarPorClick,
            ordenarPor
          )}
      </div>
    </div>
  );
};

export default BarraPesquisaFiltro;
