import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { useAccommodation } from '@/hooks/useAccommodation';
import CardHospedagens from '@/components/custom/CardHospedagens';
import type { Accommodation } from '@/types/accommodation';

export default function Host() {
  const { getMyRecords, loading } = useAccommodation();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);

  useEffect(() => {
    getMyRecords().then(setAccommodations);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Minhas Hospedagens</h1>

        <Link to="/new-accommodation">
          <Button className="gap-2">
            <Plus size={18} />
            Criar Hospedagem
          </Button>
        </Link>
      </div>

      {/* Lista */}
      {loading && <p className="text-muted-foreground">Carregando acomodações...</p>}

      {!loading && accommodations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Parece que você não tem nenhum anúncio ativo... Clique em{' '}
            <strong>“Criar Hospedagem”</strong> para anunciar.
          </CardContent>
        </Card>
      )}

      {!loading && accommodations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accommodations.map(acc => (
            <CardHospedagens key={acc.id} accommodationData={acc} />
          ))}
        </div>
      )}
    </div>
  );
}
