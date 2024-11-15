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

  const handleFilterClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSort = (option) => {
    setSortOption(option);
  };

  const handleDetalhesClick = (accommodation) => {
    setSelectedAccommodation(accommodation);
  };

  const handleBackToList = () => {
    setSelectedAccommodation(null);
  };

  // Filtra as acomodações com base na pesquisa e na categoria
  const filteredAccommodations = accommodations.filter((item) => {
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
    const matchesSearchTerm = item.city
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  // Ordena as acomodações com base na opção de ordenação
  const sortedAccommodations = sortOption
    ? filteredAccommodations.sort((a, b) => {
        if (sortOption === "Avaliação") {
          return b.rating - a.rating; // Ordena por avaliação (exemplo)
        } else if (sortOption === "Mais recentes") {
          return new Date(b.date_created) - new Date(a.date_created); // Ordena por mais recentes
        } else if (sortOption === "Mais antigos") {
          return new Date(a.date_created) - new Date(b.date_created); // Ordena por mais antigos
        }
        return 0;
      })
    : filteredAccommodations;

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
