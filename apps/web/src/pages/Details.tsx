import { useState, useEffect } from 'react';
import { CiLocationOn } from 'react-icons/ci';
import { useUser } from '@/hooks/useUser';
import { Accommodation } from '@/types';

interface DetalhesProps {
  image?: string;
  title: string;
  creator_id: string;
  price_per_night: string;
  city?: string;
  onClick?: () => void;
}

interface PublicUserData {
  id: string;
  username: string;
  avatar?: string;
}

const Details: React.FC<DetalhesProps> = ({
  image,
  title,
  creator_id,
  price_per_night,
  city,
  onClick,
}) => {
  const { getPublicUser } = useUser();
  const [creatorData, setCreatorData] = useState<PublicUserData | null>(null);

  useEffect(() => {
    if (!creator_id) return;

    const fetchCreator = async () => {
      const data = await getPublicUser(creator_id);
      setCreatorData(data);
    };

    fetchCreator();
  }, [creator_id, getPublicUser]);

  const imageUrl = image
    ? `${import.meta.env.VITE_API_BASE_URL}${image}`
    : 'media/default-image.jpg';

  return (
    <div
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className="rounded-md overflow-hidden shadow-sm"
    >
      <div className="w-full h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title || 'Imagem da acomodação'}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">
          {creatorData?.username || 'Nome do Criador Indisponível'}
        </p>
        <p className="mt-1">
          <strong>R$ {price_per_night}</strong> por noite
        </p>

        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
          <CiLocationOn />
          <span>{city || 'Cidade Indisponível'}</span>
        </div>
      </div>
    </div>
  );
};

export default Details;
