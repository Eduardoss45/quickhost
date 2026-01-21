import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Eye, Pencil } from 'lucide-react';
import type { Accommodation } from '@/types/accommodation';
import { useUser } from '@/hooks/useUser';
import { useFavoritesStore } from '@/store/favorites.store';
import { FaRegTrashAlt } from 'react-icons/fa';

interface Props {
  accommodation: Accommodation;
  showActions?: boolean;
  showCreator?: boolean;
  enableFavoritesActions?: boolean;
  className?: string;
}

const AccommodationCard: React.FC<Props> = ({
  accommodation,
  showActions = false,
  showCreator = false,
  className = '',
  enableFavoritesActions = false,
}) => {
  const { getPublicUser, isAuthenticated } = useUser();
  const { removeFavorite, isFavorited } = useFavoritesStore();
  const [creatorName, setCreatorName] = useState<string>('Criador desconhecido');

  const cacheBuster = useMemo(() => Date.now(), [accommodation.id]);

  const imageUrl = useMemo(() => {
    return accommodation.main_cover_image
      ? `${import.meta.env.VITE_API_BASE_URL}${accommodation.main_cover_image}?v=${cacheBuster}`
      : '/placeholder.jpg';
  }, [accommodation.main_cover_image, cacheBuster]);

  useEffect(() => {
    let isMounted = true;
    if (!accommodation.creator_id) return;

    const fetchCreator = async () => {
      const user = await getPublicUser(accommodation.creator_id);
      if (isMounted) {
        setCreatorName(user?.username || user?.social_name || 'Criador desconhecido');
      }
    };

    fetchCreator();

    return () => {
      isMounted = false;
    };
  }, [accommodation.creator_id, getPublicUser]);

  return (
    <div
      className={`flex flex-col rounded-xl shadow-2xl overflow-hidden text-card-foreground w-60 brightness-95 ${className}`}
    >
      <div className="w-full aspect-4/3 overflow-hidden">
        <img src={imageUrl} alt={accommodation.title} className="w-full h-full object-cover" />
      </div>

      <div className="p-3 flex flex-col gap-2 text-sm">
        <h2 className="font-semibold">{accommodation.title}</h2>

        {showCreator && <p className="text-muted-foreground">{creatorName}</p>}

        <p className="text-muted-foreground">R$ {accommodation.price_per_night} / noite</p>

        {accommodation.city && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin size={16} />
            <span>{accommodation.city}</span>
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Link to={`/acomodacao/${accommodation.id}`} className="flex-1">
              <button className="flex w-full justify-center items-center gap-2 p-2 bg-blue-500 text-white rounded-sm text-sm">
                <Eye size={16} /> Ver
              </button>
            </Link>

            <Link to={`/editor-accommodation/${accommodation.id}`} className="flex-1">
              <button className="flex w-full justify-center items-center gap-2 p-2 bg-orange-500 text-white rounded-sm text-sm">
                <Pencil size={16} /> Editar
              </button>
            </Link>
          </div>
        )}
      </div>

      {enableFavoritesActions && isAuthenticated && (
        <div className="p-2 flex justify-center">
          <button
            disabled={!isFavorited(accommodation.id)}
            onClick={() => removeFavorite(accommodation.id)}
            className={`
        px-6 py-2 text-sm rounded-sm transition flex items-center gap-2
        ${
          isFavorited(accommodation.id)
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }
      `}
          >
            <FaRegTrashAlt className="text-2xl" /> Remover dos favoritos
          </button>
        </div>
      )}
    </div>
  );
};

export default AccommodationCard;
