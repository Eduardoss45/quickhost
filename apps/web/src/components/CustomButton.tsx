import React from "react";
import './css/CustomButton.css';

const CustomButton = ({ icon, label, isActive, onClick }) => {
  return (
    <div
      className={`btn-form-custom ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
};

export default CustomButton;
