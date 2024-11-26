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
          return b.rating - a.rating;
        } else if (sortOption === "newest") {
          return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortOption === "oldest") {
          return new Date(a.created_at) - new Date(b.created_at);
        } else if (sortOption === "") {
          return 0;
        }
        return 0;
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
                price_per_night={item.final_price}
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
