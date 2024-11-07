import { useState } from "react";
import Detalhes from "../components/Detalhes";
import Filter from "../components/Filter";
import Anuncio from "../components/Anuncio";

import "./Home.css";

const Home = ({ accommodations }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAccommodation, setSelectedAccommodation] = useState(null); // Estado para o anúncio selecionado

  const handleFilterClick = (category) => {
    setSelectedCategory(category);
  };

  const handleDetalhesClick = (accommodation) => {
    console.log("Detalhes clicado:", accommodation);
    setSelectedAccommodation(accommodation); // Armazena o anúncio selecionado
  };

  const handleBackToList = () => {
    setSelectedAccommodation(null); // Limpa o anúncio selecionado para voltar à lista
  };

  const filteredAccommodations = selectedCategory
    ? accommodations.filter((item) => item.category === selectedCategory)
    : accommodations;

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
            <Filter onFilterClick={handleFilterClick} />
          </div>
          <div id="area-anuncio">
            {filteredAccommodations.map((item) => (
              <Detalhes
                key={item.id_accommodation}
                image={
                  (item.internal_images && item.internal_images[0]) ||
                  "media/default-image.jpg"
                }
                status={item.is_active}
                title={item.title}
                description={item.description}
                price={item.price_per_night}
                category={item.category}
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
