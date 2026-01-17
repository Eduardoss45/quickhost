import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { PiMinusThin, PiPlusThin } from 'react-icons/pi';
import { LiaUmbrellaBeachSolid } from 'react-icons/lia';
import { MdBedroomParent, MdChalet } from 'react-icons/md';
import { FaBuilding, FaHouse } from 'react-icons/fa6';
import { Category } from '@/enums';

import type { AccommodationFormValues } from '@/schemas/accommodation-form.schema';
import CustomButton from '@/pages/CustomButton';

type CountFields = 'room_count' | 'bed_count' | 'bathroom_count' | 'guest_capacity';

export default function AccommodationBasicsDetailsForm() {
  const { setValue, watch } = useFormContext<AccommodationFormValues>();

  const labels = [
    Category.INN,
    Category.CHALET,
    Category.APARTMENT,
    Category.HOME,
    Category.ROOM,
  ] as const;

  const translatedLabels = ['Pousada', 'Chalé', 'Apartamento', 'Casa', 'Quarto'];

  const values = ['Quartos', 'Camas', 'Banheiro', 'Hóspedes acomodados'];

  const icons = [
    <LiaUmbrellaBeachSolid key="umbrella" />,
    <MdChalet key="chalet" />,
    <FaBuilding key="building" />,
    <FaHouse key="house" />,
    <MdBedroomParent key="bedroom" />,
  ];

  const min = 1;
  const max = 20;

  const category = watch('category');

  const counts: Record<CountFields, number> = {
    room_count: watch('room_count') ?? 1,
    bed_count: watch('bed_count') ?? 1,
    bathroom_count: watch('bathroom_count') ?? 1,
    guest_capacity: watch('guest_capacity') ?? 1,
  };

  const [activeButton, setActiveButton] = useState<number | null>(null);

  useEffect(() => {
    if (category) {
      const index = labels.indexOf(category as (typeof labels)[number]);
      if (index !== -1) setActiveButton(index);
    }
  }, [category]);

  const handleChange = (key: CountFields, value: number) => {
    const valid = Math.max(min, Math.min(max, value));
    setValue(key, valid, { shouldValidate: true });
  };

  const increment = (key: CountFields) => {
    handleChange(key, counts[key] + 1);
  };

  const decrement = (key: CountFields) => {
    handleChange(key, counts[key] - 1);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Selecione o tipo de hospedagem</h2>

        <div className="flex gap-4 flex-wrap">
          {labels.map((label, index) => (
            <CustomButton
              key={label}
              icon={icons[index]}
              label={translatedLabels[index]}
              isActive={activeButton === index}
              onClick={() => {
                setActiveButton(index);
                setValue('category', label, { shouldValidate: true });
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Adicione informações básicas</h2>

        <div className="space-y-4">
          {(Object.keys(counts) as CountFields[]).map((key, index) => (
            <div key={key} className="flex items-center justify-between max-w-md">
              <label className="font-medium">{values[index]}</label>

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => decrement(key)}>
                  <PiMinusThin size={20} />
                </button>

                <input
                  type="number"
                  min={min}
                  max={max}
                  value={counts[key]}
                  onChange={e => handleChange(key, Number(e.target.value))}
                  className="w-16 text-center border rounded"
                />

                <button type="button" onClick={() => increment(key)}>
                  <PiPlusThin size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
