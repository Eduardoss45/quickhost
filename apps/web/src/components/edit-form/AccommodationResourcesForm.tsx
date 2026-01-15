import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FaWifi, FaCar, FaSwimmingPool, FaMedkit } from 'react-icons/fa';
import { LuMonitor } from 'react-icons/lu';
import { GrRestaurant } from 'react-icons/gr';
import { CgSmartHomeWashMachine } from 'react-icons/cg';
import { TbAirConditioning, TbBeach } from 'react-icons/tb';
import { MdHotTub, MdOutdoorGrill, MdFitnessCenter } from 'react-icons/md';
import { WiSmoke } from 'react-icons/wi';
import { PiFireExtinguisherBold, PiSecurityCameraThin } from 'react-icons/pi';
import { AccommodationFormValues } from '@/schemas/accommodation-form.schema';
import { ResourceKey } from '@/types';

export default function AccommodationResourcesForm() {
  const { control, watch } = useFormContext();
  const resources = watch();

  const resourcesOptions: {
    key: ResourceKey;
    label: string;
    icon: React.ReactNode;
  }[] = [
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
  ];

  const securityOptions: {
    key: ResourceKey;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { key: 'smoke_detector', label: 'Detector de fumaça', icon: <WiSmoke /> },
    { key: 'fire_extinguisher', label: 'Extintor', icon: <PiFireExtinguisherBold /> },
    { key: 'first_aid_kit', label: 'Kit de primeiros socorros', icon: <FaMedkit /> },
    { key: 'outdoor_camera', label: 'Câmera externa', icon: <PiSecurityCameraThin /> },
  ];

  const renderCheckbox = (
    key: keyof AccommodationFormValues,
    label: string,
    icon: React.ReactNode
  ) => (
    <Controller
      key={key}
      name={key}
      control={control}
      render={({ field }) => (
        <button
          type="button"
          onClick={() => field.onChange(!field.value)}
          className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition ${
            field.value
              ? 'bg-orange-500 text-white border-orange-500'
              : 'bg-white text-gray-700 border-gray-300'
          } hover:bg-orange-100`}
        >
          <div className="text-2xl">{icon}</div>
          <span className="text-sm text-center">{label}</span>
        </button>
      )}
    />
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Comodidades</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {resourcesOptions.map(r => renderCheckbox(r.key, r.label, r.icon))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Itens de Segurança</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {securityOptions.map(s => renderCheckbox(s.key, s.label, s.icon))}
        </div>
      </div>
    </div>
  );
}
