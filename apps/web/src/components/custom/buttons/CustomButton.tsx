import React from 'react';

interface CustomButtonProps {
  icon?: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer select-none ${
        isActive ? 'border border-black' : 'border border-transparent'
      }`}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </div>
  );
};

export default CustomButton;
