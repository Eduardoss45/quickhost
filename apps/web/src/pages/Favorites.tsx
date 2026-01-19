import { useEffect, useState } from 'react';
import AccommodationCard from '@/components/custom/AccommodationCard';
import { useFavoritesStore } from '@/store/favorites.store';
import { useAccommodation } from '@/hooks/useAccommodation';
import type { Accommodation } from '@/types';
import { Link } from 'react-router-dom';
import { TfiClose } from 'react-icons/tfi';
import { Card, CardContent } from '@/components/ui/card';

export default function Favorites() {
  const { favorites, fetchFavorites, loading: loadingFavorites } = useFavoritesStore();
  const { getById } = useAccommodation();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    if (favorites.length === 0) {
      setAccommodations([]);
      return;
    }

    const load = async () => {
      setLoadingData(true);

      const results = await Promise.all(favorites.map(id => getById(id)));

      setAccommodations(results.filter(Boolean) as Accommodation[]);

      setLoadingData(false);
    };

    load();
  }, [favorites]);

  if (loadingFavorites || loadingData) {
    return <p>Carregando favoritos...</p>;
  }

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <div className="mx-10 my-8 flex gap-2 items-center mt-3">
        <Link to="/" className="flex items-center gap-2">
          <TfiClose className="text-3xl" />
        </Link>

        <div>
          <h2 className="text-2xl">Favoritos</h2>
        </div>
      </div>

      {accommodations.length === 0 && (
        <Card className="border-none shadow-none">
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhuma acomodação favoritada!
          </CardContent>
        </Card>
      )}

      <div className="flex w-full m-3 gap-10 justify-center flex-wrap">
        {accommodations.map(accommodation => (
          <AccommodationCard
            key={accommodation.id}
            accommodation={accommodation}
            enableFavoritesActions
          />
        ))}
      </div>
    </div>
  );
}
