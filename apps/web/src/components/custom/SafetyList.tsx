import { Accommodation } from '@/types';
import { FaMedkit } from 'react-icons/fa';
import { WiSmoke } from 'react-icons/wi';
import { PiFireExtinguisherBold, PiSecurityCameraThin } from 'react-icons/pi';

interface Props {
  accommodation: Accommodation;
}

export default function SafetyList({ accommodation }: Props) {
  const items = [
    {
      label: 'Kit de primeiros socorros',
      enabled: accommodation.first_aid_kit,
      icon: <FaMedkit />,
    },
    { label: 'Detector de fumaça', enabled: accommodation.smoke_detector, icon: <WiSmoke /> },
    {
      label: 'Extintor de incêndio',
      enabled: accommodation.fire_extinguisher,
      icon: <PiFireExtinguisherBold />,
    },
    {
      label: 'Câmera externa',
      enabled: accommodation.outdoor_camera,
      icon: <PiSecurityCameraThin />,
    },
  ];

  return (
    <section className="mt-6">
      <h3 className="font-semibold mb-3">Segurança</h3>

      <ul className="grid grid-cols-2 gap-3 text-sm">
        {items
          .filter(item => item.enabled)
          .map(item => (
            <li key={item.label} className="flex items-center gap-2">
              {item.icon}
              {item.label}
            </li>
          ))}
      </ul>
    </section>
  );
}
