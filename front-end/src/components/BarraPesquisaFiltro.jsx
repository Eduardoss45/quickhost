import React, { useState } from "react";
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
    Todos: "", // Aqui, 'Todos' pode ser interpretado como todos os tipos de acomodação, sem filtro
  };

  const handleTipoHospedagemClick = (tipo) => {
    setTipoHospedagem(tipo);
    setOpenTipoHospedagem(false);
    onFilterClick(categoryMapping[tipo] || ""); // Passa a categoria mapeada para o pai
  };

  const handleOrdenarPorClick = (ordenacao) => {
    setOrdenarPor(ordenacao);
    setOpenOrdenarPor(false);
    onSort(ordenacao); // Passa a ordenação para o pai
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    onSearch(searchTerm); // Passa o termo de pesquisa para o pai
  };

  return (
    <div className="search-bar">
      <IoSearchOutline className="search-icon" />
      <div className="search-input">
        <input
          type="text"
          placeholder="Digite o nome da localidade..."
          onChange={handleSearchChange} // Chama a função para passar a pesquisa
        />
      </div>
      <CiFilter className="filter-icon" />
      <div className="dropdown">
        <button
          onClick={() => setOpenTipoHospedagem(!openTipoHospedagem)}
          className={`dropdown-button ${openTipoHospedagem ? "open" : ""}`}
        >
          {tipoHospedagem}
          <HiChevronDown />
        </button>
        <div
          className={`dropdown-line ${openTipoHospedagem ? "" : "visible"}`}
        ></div>
        {openTipoHospedagem && (
          <div className={`dropdown-menu ${openTipoHospedagem ? "" : "open"}`}>
            <div onClick={() => handleTipoHospedagemClick("Pousada")}>
              Pousada
            </div>
            <div onClick={() => handleTipoHospedagemClick("Chalé")}>Chalé</div>
            <div onClick={() => handleTipoHospedagemClick("Apartamento")}>
              Apartamento
            </div>
            <div onClick={() => handleTipoHospedagemClick("Casa")}>Casa</div>
            <div onClick={() => handleTipoHospedagemClick("Quarto")}>
              Quarto
            </div>
            <div onClick={() => handleTipoHospedagemClick("Todos")}>Todos</div>
          </div>
        )}
      </div>
      <div className="dropdown">
        <button
          onClick={() => setOpenOrdenarPor(!openOrdenarPor)}
          className={`dropdown-button ${openOrdenarPor ? "open" : ""}`}
        >
          {ordenarPor}
          <HiChevronDown />
        </button>
        <div
          className={`dropdown-line ${openOrdenarPor ? "" : "visible"}`}
        ></div>
        {openOrdenarPor && (
          <div className={`dropdown-menu ${openOrdenarPor ? "" : "open"}`}>
            <div onClick={() => handleOrdenarPorClick("Avaliação")}>
              Avaliação
            </div>
            <div onClick={() => handleOrdenarPorClick("Mais recentes")}>
              Mais recentes
            </div>
            <div onClick={() => handleOrdenarPorClick("Mais antigos")}>
              Mais antigos
            </div>
            <div onClick={() => handleOrdenarPorClick("Todos")}>Todos</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarraPesquisaFiltro;
