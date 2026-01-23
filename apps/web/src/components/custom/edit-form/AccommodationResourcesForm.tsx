import { useFormContext } from 'react-hook-form';
import type { AccommodationFormValues } from '@/schemas/accommodation-form.schema';
import CustomButton from '@/components/custom/buttons/CustomButton';
import { FaWifi, FaCar, FaSwimmingPool, FaMedkit } from 'react-icons/fa';
import { LuMonitor } from 'react-icons/lu';
import { GrRestaurant } from 'react-icons/gr';
import { CgSmartHomeWashMachine } from 'react-icons/cg';
import { TbAirConditioning, TbBeach } from 'react-icons/tb';
import { MdHotTub, MdOutdoorGrill, MdFitnessCenter } from 'react-icons/md';
import { WiSmoke } from 'react-icons/wi';
import { PiFireExtinguisherBold, PiSecurityCameraThin } from 'react-icons/pi';

export default function AccommodationResourcesForm() {
  const { watch, setValue } = useFormContext<AccommodationFormValues>();

  const values = watch();

  const toggle = (key: keyof AccommodationFormValues) => {
    setValue(key, !values[key], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const resourcesOptions = [
    { key: 'wifi', label: 'Wi-Fi', icon: <FaWifi /> },
    { key: 'tv', label: 'TV', icon: <LuMonitor /> },
    { key: 'kitchen', label: 'Cozinha', icon: <GrRestaurant /> },
    { key: 'washing_machine', label: 'Máquina de lavar', icon: <CgSmartHomeWashMachine /> },
    { key: 'parking_included', label: 'Estacionamento', icon: <FaCar /> },
    { key: 'air_conditioning', label: 'Ar-condicionado', icon: <TbAirConditioning /> },
    { key: 'pool', label: 'Piscina', icon: <FaSwimmingPool /> },
    { key: 'jacuzzi', label: 'Jacuzzi', icon: <MdHotTub /> },
    { key: 'grill', label: 'Churrasqueira', icon: <MdOutdoorGrill /> },
    { key: 'private_gym', label: 'Academia privativa', icon: <MdFitnessCenter /> },
    { key: 'beach_access', label: 'Acesso à praia', icon: <TbBeach /> },
  ] as const;

  const securityOptions = [
    { key: 'smoke_detector', label: 'Detector de fumaça', icon: <WiSmoke /> },
    { key: 'fire_extinguisher', label: 'Extintor', icon: <PiFireExtinguisherBold /> },
    { key: 'first_aid_kit', label: 'Primeiros socorros', icon: <FaMedkit /> },
    { key: 'outdoor_camera', label: 'Câmera externa', icon: <PiSecurityCameraThin /> },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-3">Comodidades</h2>
        <div className="flex flex-wrap gap-3">
          {resourcesOptions.map(({ key, label, icon }) => (
            <CustomButton
              key={key}
              label={label}
              icon={icon}
              isActive={!!values[key]}
              onClick={() => toggle(key)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Segurança</h2>
        <div className="flex flex-wrap gap-3">
          {securityOptions.map(({ key, label, icon }) => (
            <CustomButton
              key={key}
              label={label}
              icon={icon}
              isActive={!!values[key]}
              onClick={() => toggle(key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
