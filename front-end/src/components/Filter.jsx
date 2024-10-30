import React from "react";
import "./Filter.css";

const Filter = ({ onFilterClick }) => {
  const options = ["Todos", "Pousada", "Chalé", "Apto", "Casa", "Quarto"];
  const CATEGORY_CHOICES = [
    { value: "inn", label: "Pousada" },
    { value: "chalet", label: "Chalé" },
    { value: "apartment", label: "Apto" },
    { value: "home", label: "Casa" },
    { value: "room", label: "Quarto" },
  ];

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const handleButtonClick = (option) => {
    if (option === "Todos") {
      onFilterClick(""); // Reset the filter for "Todos"
    } else {
      const categoryChoice = CATEGORY_CHOICES.find(
        (choice) => choice.label === option
      );
      const cleanedOption = categoryChoice
        ? removeAccents(categoryChoice.value)
        : "";
      onFilterClick(cleanedOption);
    }
  };

  return (
    <>
      {options.map((option, index) => (
        <div key={index}>
          <button
            className="opt-filtros"
            onClick={() => handleButtonClick(option)}
          >
            {option}
          </button>
        </div>
      ))}
    </>
  );
};

export default Filter;
