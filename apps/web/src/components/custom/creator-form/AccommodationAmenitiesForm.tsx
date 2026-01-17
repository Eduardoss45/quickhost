import { useFormContext } from 'react-hook-form';
import type { AccommodationFormValues } from '@/schemas/accommodation-form.schema';
import CustomButton from '@/pages/CustomButton';

export default function AccommodationAmenitiesForm() {
  const { watch, setValue } = useFormContext<AccommodationFormValues>();

  const toggle = (key: keyof AccommodationFormValues) => {
    setValue(key, !watch(key), { shouldValidate: true });
  };

  const resources: (keyof AccommodationFormValues)[] = [
    'wifi',
    'tv',
    'kitchen',
    'washing_machine',
    'parking_included',
    'air_conditioning',
    'pool',
    'jacuzzi',
    'grill',
    'private_gym',
    'beach_access',
  ];

  const security: (keyof AccommodationFormValues)[] = [
    'smoke_detector',
    'fire_extinguisher',
    'first_aid_kit',
    'outdoor_camera',
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Comodidades</h2>
        <div className="flex flex-wrap gap-3">
          {resources.map(key => (
            <CustomButton
              key={key}
              label={key}
              isActive={!!watch(key)}
              onClick={() => toggle(key)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Segurança</h2>
        <div className="flex flex-wrap gap-3">
          {security.map(key => (
            <CustomButton
              key={key}
              label={key}
              isActive={!!watch(key)}
              onClick={() => toggle(key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
