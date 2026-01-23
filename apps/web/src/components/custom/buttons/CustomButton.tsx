import React from 'react';

interface CustomButtonProps {
  icon?: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ icon, label, isActive, onClick }) => {
  console.log(isActive);
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer select-none rounded-md p-4 w-40 shadow-2xl ${
        isActive ? 'text-white bg-blue-500' : ''
      }`}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </div>
  );
};

export default CustomButton;
