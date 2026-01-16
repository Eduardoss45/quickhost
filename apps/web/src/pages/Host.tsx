import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BiPlus } from 'react-icons/bi';
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
    <div className="space-y-6 my-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl">Minhas Hospedagens</h1>

        <Link to="/new-accommodation">
          <button className="flex p-2 gap-2 items-center justify-center rounded-sm bg-orange-400 text-white">
            <span className="text-2xl">
              <BiPlus />
            </span>
            Criar Hospedagem
          </button>
        </Link>
      </div>

      {loading && <p className="text-muted-foreground">Carregando acomodações...</p>}

      {!loading && accommodations.length === 0 && (
        <Card className="border-none shadow-none">
          <CardContent className="p-8 text-center text-muted-foreground">
            Parece que você não tem nenhum anúncio ativo... Clique em{' '}
            <strong>“Criar Hospedagem”</strong> para anunciar.
          </CardContent>
        </Card>
      )}

      {!loading && accommodations.length > 0 && (
        <div className="flex w-full m-3 gap-10 justify-center flex-wrap">
          {accommodations.map(acc => (
            <>
              <CardHospedagens key={acc.id} accommodationData={acc} />
            </>
          ))}
        </div>
      )}
    </div>
  );
}
