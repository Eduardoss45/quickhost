import { useState } from "react";
import Detalhes from "../components/Detalhes";
import Filter from "../components/Filter";

import "./Home.css";

const Home = ({ accommodations }) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleFilterClick = (category) => {
    setSelectedCategory(category);
  };

  // Filtra as acomodações pela categoria selecionada
  const filteredAccommodations = selectedCategory
    ? accommodations.filter((item) => item.category === selectedCategory)
    : accommodations;
  console.log(filteredAccommodations);

  return (
    <>
      <div id="filtros">
        <Filter onFilterClick={handleFilterClick} />
      </div>
      <div id="area-anuncio">
        {filteredAccommodations.map((item, index) => (
          <Detalhes
            key={index}
            image={item.internal_images[0] || "media/default-image.jpg"} // Primeira imagem ou padrão
            title={item.title} // Título da acomodação
            description={item.description} // Descrição da acomodação
            price={item.price_per_night} // Alinha ao campo correto
            category={item.category} // Categoria da acomodação
            // Adicione outras propriedades que você precisar
          />
        ))}
      </div>
    </>
  );
};

export default Home;
