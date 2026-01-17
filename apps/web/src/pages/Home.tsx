import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import BarraPesquisaFiltro from './BarraPesquisaFiltro';
import { useAccommodation } from '@/hooks/useAccommodation';
import { Accommodation } from '@/types';
import { Category } from '@/enums';
import AccommodationCard from '@/components/custom/AccommodationCard';

const Home: React.FC = () => {
  const { getAll } = useAccommodation();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    const fetchAccommodations = async () => {
      setLoading(true);
      const data = await getAll();
      setAccommodations(data);
      setLoading(false);
    };
    fetchAccommodations();
  }, []);

  const filteredAccommodations = useMemo(() => {
    return accommodations.filter(item => {
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      const matchesSearchTerm = item.city
        ? item.city.toLowerCase().includes(searchTerm.toLowerCase())
        : false;
      return matchesCategory && matchesSearchTerm;
    });
  }, [accommodations, selectedCategory, searchTerm]);

  const sortedAccommodations = useMemo(() => {
    if (!sortOption) return filteredAccommodations;

    return [...filteredAccommodations].sort((a, b) => {
      if (sortOption === 'rating')
        return parseFloat(b.average_rating) - parseFloat(a.average_rating);
      if (sortOption === 'newest')
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortOption === 'oldest')
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return 0;
    });
  }, [filteredAccommodations, sortOption]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="m-3">
      <BarraPesquisaFiltro
        onSearch={setSearchTerm}
        onFilterClick={cat => setSelectedCategory(cat ? (cat as Category) : '')}
        onSort={setSortOption}
      />

      <div className="flex w-full m-3 gap-10 justify-center flex-wrap">
        {sortedAccommodations.map(item => (
          <Link key={item.id} to={`/acomodacao/${item.id}`}>
            <AccommodationCard
              accommodation={item}
              showCreator={true} // mostra nome do criador
              showActions={false} // sem botões "editar/ver"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
