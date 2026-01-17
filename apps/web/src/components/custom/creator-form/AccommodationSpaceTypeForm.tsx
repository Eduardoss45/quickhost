import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MdBedroomParent } from 'react-icons/md';
import { FaHouse } from 'react-icons/fa6';

import { SpaceType } from '@/enums';
import type { AccommodationFormValues } from '@/schemas/accommodation-form.schema';

export default function AccommodationSpaceTypeForm() {
  const { setValue, watch } = useFormContext<AccommodationFormValues>();

  const current = watch('space_type');
  const [selected, setSelected] = useState<SpaceType | null>(null);

  useEffect(() => {
    if (current) setSelected(current);
  }, [current]);

  const handleSelect = (value: SpaceType) => {
    setSelected(value);
    setValue('space_type', value, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Selecione o tipo de espaço</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleSelect(SpaceType.FULL_SPACE)}
          className={`border p-4 rounded ${selected === SpaceType.FULL_SPACE ? 'border-black' : ''}`}
        >
          <FaHouse size={28} />
          <h3 className="font-medium mt-2">Espaço inteiro</h3>
          <p className="text-sm text-gray-500">Acomodação completa</p>
        </button>

        <button
          type="button"
          onClick={() => handleSelect(SpaceType.LIMITED_SPACE)}
          className={`border p-4 rounded ${selected === SpaceType.LIMITED_SPACE ? 'border-black' : ''}`}
        >
          <MdBedroomParent size={28} />
          <h3 className="font-medium mt-2">Quarto</h3>
          <p className="text-sm text-gray-500">Quarto privado + áreas compartilhadas</p>
        </button>
      </div>
    </div>
  );
}
