import { ReactNode } from 'react';

type NavButtonProps = {
  icon: ReactNode;
  label: string;
};

const NavButton = ({ icon, label }: NavButtonProps) => (
  <button className="rounded border border-white bg-transparent">
    <span className="flex items-center gap-3 px-4 py-1.5 font-medium text-white">
      <span className="text-2xl">{icon}</span>
      {label}
    </span>
  </button>
);

export default NavButton;
