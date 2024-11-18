import { useMemo } from "react";
import { useState } from "react";
import Detalhes from "../components/Detalhes";
import Anuncio from "../components/Anuncio";
import BarraPesquisaFiltro from "../components/BarraPesquisaFiltro";

import "./Home.css";

const Home = ({ accommodations }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  console.log(accommodations);

  const handleFilterClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSort = (option) => {
    setSortOption(option);
    console.log(option);
  };

  const handleDetalhesClick = (accommodation) => {
    setSelectedAccommodation(accommodation);
  };

  const handleBackToList = () => {
    setSelectedAccommodation(null);
  };

  const filteredAccommodations = accommodations.filter((item) => {
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
    const matchesSearchTerm = item.city
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  const sortedAccommodations = useMemo(() => {
    if (!filteredAccommodations || filteredAccommodations.length === 0) {
      return [];
    }

    if (!sortOption) {
      return filteredAccommodations;
    }

    return [...filteredAccommodations].sort(
      (a, b) => {
        if (sortOption === "rating") {
          return b.rating - a.rating; // Ordenação por avaliação
        } else if (sortOption === "newest") {
          // Ordenação por data de criação, mais recente primeiro
          return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortOption === "oldest") {
          // Ordenação por data de criação, mais antigo primeiro
          return new Date(a.created_at) - new Date(b.created_at);
        } else if (sortOption === "") {
          // Caso não haja opção de ordenação, retorna as acomodações sem alteração
          return 0; // Não altera a ordem, retornando as acomodações na ordem original
        }
        return 0; // Caso não tenha nenhuma opção de ordenação válida
      },
      [filteredAccommodations, sortOption]
    );
  });
  return (
    <>
      {selectedAccommodation ? (
        <Anuncio
          accommodation={selectedAccommodation}
          onBack={handleBackToList}
        />
      ) : (
        <>
          <div id="filtros">
            <BarraPesquisaFiltro
              onSearch={handleSearch}
              onFilterClick={handleFilterClick}
              onSort={handleSort}
            />
          </div>
          <div id="area-anuncio">
            {sortedAccommodations.map((item) => (
              <Detalhes
                key={item.id_accommodation}
                image={
                  (item.internal_images && item.internal_images[0]) ||
                  "media/default-image.jpg"
                }
                title={item.title}
                creator={item.creator}
                price_per_night={item.price_per_night}
                city={item.city}
                onClick={() => handleDetalhesClick(item)}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
