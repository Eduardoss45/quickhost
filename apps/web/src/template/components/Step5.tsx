import React, { useState } from "react";
import { FaWifi, FaCar, FaSwimmingPool, FaMedkit } from "react-icons/fa";
import { LuMonitor } from "react-icons/lu";
import { GrRestaurant } from "react-icons/gr";
import { CgSmartHomeWashMachine } from "react-icons/cg";
import { TbAirConditioning, TbBeach } from "react-icons/tb";
import { MdHotTub, MdOutdoorGrill, MdFitnessCenter } from "react-icons/md";
import { WiSmoke } from "react-icons/wi";
import { PiFireExtinguisherBold, PiSecurityCameraThin } from "react-icons/pi";
import CustomButton from "../../components/CustomButton";
import "./css/Step5.css";

const Step5 = ({ data, updateFieldHandler }) => {
  const [resources, setResources] = useState({
    wifi: data.wifi || false,
    tv: data.tv || false,
    kitchen: data.kitchen || false,
    washing_machine: data.washing_machine || false,
    parking_included: data.parking_included || false,
    air_conditioning: data.air_conditioning || false,
    pool: data.pool || false,
    jacuzzi: data.jacuzzi || false,
    grill: data.grill || false,
    private_gym: data.private_gym || false,
    beach_access: data.beach_access || false,
  });

  const [security, setSecurity] = useState({
    smoke_detector: data.smoke_detector || false,
    fire_extinguisher: data.fire_extinguisher || false,
    first_aid_kit: data.first_aid_kit || false,
    outdoor_camera: data.outdoor_camera || false,
  });

  const toggleResource = (key) => {
    setResources((prev) => {
      const newValue = !prev[key];
      updateFieldHandler({ target: { name: key, value: newValue } });
      return { ...prev, [key]: newValue };
    });
  };

  const toggleSecurity = (key) => {
    setSecurity((prev) => {
      const newValue = !prev[key];
      updateFieldHandler({ target: { name: key, value: newValue } });
      return { ...prev, [key]: newValue };
    });
  };

  const resourcesOptions = [
    { key: "wifi", label: "Wi-Fi", icon: <FaWifi /> },
    { key: "tv", label: "TV", icon: <LuMonitor /> },
    { key: "kitchen", label: "Cozinha", icon: <GrRestaurant /> },
    {
      key: "washing_machine",
      label: "Máquina de lavar",
      icon: <CgSmartHomeWashMachine />,
    },
    {
      key: "parking_included",
      label: "Estacionamento incluído",
      icon: <FaCar />,
    },
    {
      key: "air_conditioning",
      label: "Ar-condicionado",
      icon: <TbAirConditioning />,
    },
    { key: "pool", label: "Piscina", icon: <FaSwimmingPool /> },
    { key: "jacuzzi", label: "Jacuzzi", icon: <MdHotTub /> },
    { key: "grill", label: "Churrasqueira", icon: <MdOutdoorGrill /> },
    {
      key: "private_gym",
      label: "Academia privativa",
      icon: <MdFitnessCenter />,
    },
    { key: "beach_access", label: "Acesso à praia", icon: <TbBeach /> },
  ];

  const securityOptions = [
    { key: "smoke_detector", label: "Detector de fumaça", icon: <WiSmoke /> },
    {
      key: "fire_extinguisher",
      label: "Extintor de incêndio",
      icon: <PiFireExtinguisherBold />,
    },
    {
      key: "first_aid_kit",
      label: "Kit de primeiros socorros",
      icon: <FaMedkit />,
    },
    {
      key: "outdoor_camera",
      label: "Câmera externa",
      icon: <PiSecurityCameraThin />,
    },
  ];

  return (
    <div id="step-five">
      <h2>Selecione as comodidades da sua hospedagem</h2>
      <div className="step-five-opt">
        {resourcesOptions.map(({ key, label, icon }) => (
          <CustomButton
            key={key}
            icon={icon}
            label={label}
            isActive={resources[key]}
            onClick={() => toggleResource(key)}
          />
        ))}
      </div>
      <h2>Possui algum item de segurança?</h2>
      <div className="step-five-opt">
        {securityOptions.map(({ key, label, icon }) => (
          <CustomButton
            key={key}
            icon={icon}
            label={label}
            isActive={security[key]}
            onClick={() => toggleSecurity(key)}
          />
        ))}
      </div>
    </div>
  );
};

export default Step5;
