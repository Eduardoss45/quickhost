import { IoStarSharp } from 'react-icons/io5';
import { Accommodation } from '@/types';
import { Link } from 'react-router-dom';
import { TfiClose } from 'react-icons/tfi';
import { useFavoritesStore } from '@/store/favorites.store';

interface Props {
  accommodation: Accommodation;
}

export default function AnnouncementHeader({ accommodation }: Props) {
  const { addFavorite, removeFavorite, isFavorited, loading } = useFavoritesStore();

  const favorited = isFavorited(accommodation.id);

  const handleToggleFavorite = async () => {
    if (favorited) {
      await removeFavorite(accommodation.id);
    } else {
      await addFavorite(accommodation.id);
    }
  };

  return (
    <div className="my-6 flex justify-between">
      <div className="my-3 flex gap-2 items-center">
        <Link to="/" className="flex items-center gap-2">
          <TfiClose className="text-3xl" />
        </Link>

        <div>
          <h2 className="text-2xl uppercase">{accommodation.title}</h2>
          <p className="text-sm text-muted-foreground">
            {accommodation.address}, {accommodation.city} - {accommodation.uf}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleToggleFavorite}
          disabled={loading}
          aria-busy={loading}
          className={`
            border flex items-center px-6 py-2 rounded-md gap-2 transition
            ${favorited ? 'bg-orange-400 text-white' : 'bg-transparent'}
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <IoStarSharp className="text-2xl" />
          {favorited ? 'Favoritado' : 'Favoritar'}
        </button>
      </div>
    </div>
  );
}
