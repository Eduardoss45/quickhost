import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import AnnouncementHeader from '@/components/custom/AnnouncementHeader';
import AnnouncementGallery from '@/components/custom/AnnouncementGallery';
import AmenitiesList from '@/components/custom/AmenitiesList';
import BookingCard from '@/components/custom/BookingCard';
import CommentsSection from '@/components/custom/CommentsSection';

import { useAccommodation } from '@/hooks/useAccommodation';
import { Accommodation } from '@/types';

export default function Announcement() {
  const { id } = useParams();
  const { getById } = useAccommodation();

  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error('Id da acomodação não fornecido');
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      const data = await getById(id);
      setAccommodation(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!accommodation) {
    return <p>Acomodação não encontrada</p>;
  }

  return (
    <div className="container mx-auto">
      <AnnouncementHeader accommodation={accommodation} />
      <AnnouncementGallery
        images={accommodation.internal_images.map(img =>
          typeof img === 'string' ? img : img instanceof File ? URL.createObjectURL(img) : img.url
        )}
      />

      <div className="flex flex-row justify-between gap-2 my-4">
        <section>
          <h2 className="text-2xl">Descrição</h2>
          <p className="my-3">{accommodation.description}</p>
        </section>
        <BookingCard accommodation={accommodation} />
      </div>
      <AmenitiesList amenities={accommodation} />

      <CommentsSection accommodationId={accommodation.id} />
    </div>
  );
}
