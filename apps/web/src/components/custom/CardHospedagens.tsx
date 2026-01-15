import { MapPin, Eye, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import type { Accommodation } from '@/types/accommodation';

type Props = {
  accommodationData: Accommodation;
};

const CardHospedagens = ({ accommodationData }: Props) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition">
      <img
        src={
          accommodationData.main_cover_image
            ? `${import.meta.env.VITE_API_BASE_URL}${accommodationData.main_cover_image}`
            : '/placeholder.jpg'
        }
        alt={accommodationData.title}
        className="h-48 w-full object-cover"
      />

      <CardContent className="p-4 space-y-4">
        <div>
          <h2 className="font-semibold text-lg">{accommodationData.title}</h2>
          <p className="text-sm text-muted-foreground">
            R$ {accommodationData.price_per_night} / noite
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={16} />
          {accommodationData.city || 'Cidade não informada'}
        </div>

        <div className="flex gap-2 pt-2">
          <Link to={`/details/${accommodationData.id}`} className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Eye size={16} />
              Ver
            </Button>
          </Link>

          <Link to={`/editor-accommodation/${accommodationData.id}`} className="flex-1">
            <Button className="w-full gap-2">
              <Pencil size={16} />
              Editar
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardHospedagens;
