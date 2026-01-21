import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { PiMinusThin, PiPlusThin } from 'react-icons/pi';
import { LiaUmbrellaBeachSolid } from 'react-icons/lia';
import { MdBedroomParent, MdChalet } from 'react-icons/md';
import { FaBuilding, FaHouse } from 'react-icons/fa6';
import { Category } from '@/enums';

import type { AccommodationFormValues } from '@/schemas/accommodation-form.schema';
import CustomButton from '@/components/custom/buttons/CustomButton';

type CountFields = 'room_count' | 'bed_count' | 'bathroom_count' | 'guest_capacity';

export default function AccommodationBasicsDetailsForm() {
  const { setValue, watch } = useFormContext<AccommodationFormValues>();

  const categories = [
    { value: Category.INN, label: 'Pousada', icon: <LiaUmbrellaBeachSolid /> },
    { value: Category.CHALET, label: 'Chalé', icon: <MdChalet /> },
    { value: Category.APARTMENT, label: 'Apartamento', icon: <FaBuilding /> },
    { value: Category.HOME, label: 'Casa', icon: <FaHouse /> },
    { value: Category.ROOM, label: 'Quarto', icon: <MdBedroomParent /> },
  ] as const;

  const fieldLabels = ['Quartos', 'Camas', 'Banheiro', 'Hóspedes acomodados'];

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
    if (!category) return;

    const index = categories.findIndex(item => item.value === category);

    if (index !== -1) setActiveButton(index);
  }, [category, categories]);

  const handleChange = (key: CountFields, value: number) => {
    const valid = Math.max(min, Math.min(max, value));
    setValue(key, valid, { shouldValidate: true });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl mb-4">Selecione o tipo de hospedagem</h2>

        <div className="flex gap-4 flex-wrap">
          {categories.map((item, index) => (
            <CustomButton
              key={item.value}
              icon={item.icon}
              label={item.label}
              isActive={activeButton === index}
              onClick={() => {
                setActiveButton(index);
                setValue('category', item.value, {
                  shouldValidate: true,
                });
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl mb-4">Adicione informações básicas</h2>

        <div className="space-y-4">
          {(Object.keys(counts) as CountFields[]).map((key, index) => (
            <div key={key} className="flex items-center justify-between max-w-md shadow-2xl p-3">
              <label className="font-bold">{fieldLabels[index]}</label>

              <div className="flex items-center gap-1 border p-2 rounded-md font-bold">
                <button type="button" onClick={() => handleChange(key, counts[key] - 1)}>
                  <PiMinusThin size={20} />
                </button>

                <input
                  type="number"
                  min={min}
                  max={max}
                  value={counts[key]}
                  onChange={e => handleChange(key, Number(e.target.value))}
                  className="ml-3 text-center border-none w-10"
                />

                <button type="button" onClick={() => handleChange(key, counts[key] + 1)}>
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
