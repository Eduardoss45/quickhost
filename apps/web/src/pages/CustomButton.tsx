import React from "react";

const CustomButton = ({ icon, label, isActive, onClick }) => {
  return (
    <div

      onClick={onClick}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
};

export default CustomButton;
