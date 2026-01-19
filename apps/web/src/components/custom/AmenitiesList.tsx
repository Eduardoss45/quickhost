import { FaWifi, FaCar, FaSwimmingPool, FaMedkit } from 'react-icons/fa';
import { LuMonitor } from 'react-icons/lu';
import { GrRestaurant } from 'react-icons/gr';
import { CgSmartHomeWashMachine } from 'react-icons/cg';
import { TbAirConditioning, TbBeach } from 'react-icons/tb';
import { MdHotTub, MdOutdoorGrill, MdFitnessCenter } from 'react-icons/md';
import { WiSmoke } from 'react-icons/wi';
import { PiFireExtinguisherBold, PiSecurityCameraThin } from 'react-icons/pi';
import type { Amenities, AmenitiesResourceKey } from '@/types';
import { JSX } from 'react';

const AMENITIES_MAP: { key: AmenitiesResourceKey; label: string; icon: JSX.Element }[] = [
  { key: 'wifi', label: 'Wi-Fi', icon: <FaWifi className="text-2xl" /> },
  { key: 'tv', label: 'TV', icon: <LuMonitor className="text-2xl" /> },
  { key: 'kitchen', label: 'Cozinha', icon: <GrRestaurant className="text-2xl" /> },
  {
    key: 'washing_machine',
    label: 'Máquina de lavar',
    icon: <CgSmartHomeWashMachine className="text-2xl" />,
  },
  {
    key: 'parking_included',
    label: 'Estacionamento incluído',
    icon: <FaCar className="text-2xl" />,
  },
  {
    key: 'air_conditioning',
    label: 'Ar-condicionado',
    icon: <TbAirConditioning className="text-2xl" />,
  },
  { key: 'pool', label: 'Piscina', icon: <FaSwimmingPool className="text-2xl" /> },
  { key: 'jacuzzi', label: 'Jacuzzi', icon: <MdHotTub className="text-2xl" /> },
  { key: 'grill', label: 'Churrasqueira', icon: <MdOutdoorGrill className="text-2xl" /> },
  {
    key: 'private_gym',
    label: 'Academia privativa',
    icon: <MdFitnessCenter className="text-2xl" />,
  },
  { key: 'beach_access', label: 'Acesso à praia', icon: <TbBeach className="text-2xl" /> },
  { key: 'smoke_detector', label: 'Detector de fumaça', icon: <WiSmoke className="text-2xl" /> },
  {
    key: 'fire_extinguisher',
    label: 'Extintor de incêndio',
    icon: <PiFireExtinguisherBold className="text-2xl" />,
  },
  {
    key: 'first_aid_kit',
    label: 'Kit de primeiros socorros',
    icon: <FaMedkit className="text-2xl" />,
  },
  {
    key: 'outdoor_camera',
    label: 'Câmera externa',
    icon: <PiSecurityCameraThin className="text-2xl" />,
  },
];

export default function AmenitiesList({
  amenities,
}: {
  amenities: Partial<Pick<Amenities, AmenitiesResourceKey>>;
}) {
  const activeAmenities = AMENITIES_MAP.filter(item => amenities[item.key]);

  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      {activeAmenities.map(item => (
        <div key={item.key} className="flex items-center gap-2">
          {item.icon}
          <span className='text-bold'>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
