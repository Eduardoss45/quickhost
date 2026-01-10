import { useMemo } from 'react';
import { useState } from 'react';
import Detalhes from './Detalhes';
import Anuncio from './Anuncio';
import BarraPesquisaFiltro from './BarraPesquisaFiltro';
import { Link } from 'react-router-dom';

const Home = ({ accommodations }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  const handleFilterClick = category => {
    setSelectedCategory(category);
  };

  const handleSearch = term => {
    setSearchTerm(term);
  };

  const handleSort = option => {
    setSortOption(option);
  };

  const handleDetalhesClick = accommodation => {
    setSelectedAccommodation(accommodation);
  };

  const handleBackToList = () => {
    setSelectedAccommodation(null);
  };

  const filteredAccommodations = accommodations.filter(item => {
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesSearchTerm = item.city.toLowerCase().includes(searchTerm.toLowerCase());
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
        if (sortOption === 'rating') {
          return b.rating - a.rating;
        } else if (sortOption === 'newest') {
          return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortOption === 'oldest') {
          return new Date(a.created_at) - new Date(b.created_at);
        } else if (sortOption === '') {
          return 0;
        }
        return 0;
      },
      [filteredAccommodations, sortOption]
    );
  });
  return (
    <>
      <div id="filtros">
        <BarraPesquisaFiltro
          onSearch={handleSearch}
          onFilterClick={handleFilterClick}
          onSort={handleSort}
        />
      </div>
      <div id="area-anuncio">
        {sortedAccommodations.map(item => (
          <Link key={item.id_accommodation} to={`/acomodacao/${item?.id_accommodation}`}>
            <Detalhes
              key={item.id_accommodation}
              image={item?.main_cover_image || 'media/default-image.jpg'}
              title={item.title}
              creator={item.creator}
              price_per_night={item.price}
              city={item.city}
              onClick={() => handleDetalhesClick(item)}
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
