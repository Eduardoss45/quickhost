import { PiArrowCircleLeftThin } from 'react-icons/pi';
import { TfiClose } from 'react-icons/tfi';
import { Link } from 'react-router-dom';

type FormHeaderProps = {
  step: number;
  name?: string;
};

const stepsConfig = [
  {
    title: 'Anuncie com facilidade no Quick Host',
    subtitle: null,
    back: true,
  },
  {
    title: 'Criar uma nova hospedagem',
    subtitle: 'Informações básicas',
    back: true,
  },
  {
    title: 'Criar uma nova hospedagem',
    subtitle: 'Tipo de espaço',
  },
  {
    title: 'Criar uma nova hospedagem',
    subtitle: 'Endereço',
  },
  {
    title: 'Criar uma nova hospedagem',
    subtitle: 'Comodidades',
  },
  {
    title: 'Criar uma nova hospedagem',
    subtitle: 'Imagens',
  },
  {
    title: 'Criar uma nova hospedagem',
    subtitle: 'Descrição',
  },
  {
    title: 'Criar uma nova hospedagem',
    subtitle: 'Valor',
  },
  {
    title: 'Criar uma nova hospedagem',
    subtitle: 'Dados bancários',
  },
  {
    title: 'Criar uma nova hospedagem',
    subtitle: 'Finalizar',
  },
  {
    title: 'Editar anúncio',
    subtitle: (name?: string) => name || 'Não informado',
    back: true,
  },
  {
    title: 'Editar endereço',
    subtitle: (name?: string) => name || 'Não informado',
    back: true,
  },
  {
    title: 'Editar comodidades',
    subtitle: (name?: string) => name || 'Não informado',
    back: true,
  },
];

export default function FormHeader({ step, name }: FormHeaderProps) {
  const config = stepsConfig[step];

  if (!config) return null;

  const subtitle = typeof config.subtitle === 'function' ? config.subtitle(name) : config.subtitle;

  return (
    <div className="px-4 flex gap-2 items-center my-8">
      {config.back && (
        <Link to="/host" className="flex items-center gap-2 ">
          <TfiClose className="text-3xl" />
        </Link>
      )}

      <div>
        <h2 className="text-2xl">{config.title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
