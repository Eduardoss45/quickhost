import React, { useState, useEffect } from "react";
import { PiMinusThin, PiPlusThin } from "react-icons/pi";
import { LiaUmbrellaBeachSolid } from "react-icons/lia";
import { MdBedroomParent, MdChalet } from "react-icons/md";
import { FaBuilding, FaHouse } from "react-icons/fa6";
import CustomButton from "../../components/CustomButton";
import "./css/Step2.css";

const Step2 = ({ data, updateFieldHandler }) => {
  const labels = ["inn", "chalet", "apartment", "home", "room"];
  const translatedLabels = [
    "Pousada",
    "Chalé",
    "Apartamento",
    "Casa",
    "Quarto",
  ];
  const values = ["Quartos", "Camas", "Banheiro", "Hóspedes acomodados"];
  const icons = [
    <LiaUmbrellaBeachSolid key="umbrella" />,
    <MdChalet key="chalet" />,
    <FaBuilding key="building" />,
    <FaHouse key="house" />,
    <MdBedroomParent key="bedroom" />,
  ];

  const [activeButton, setActiveButton] = useState(null);
  const [counts, setCounts] = useState({
    room_count: data.room_count || 1,
    bed_count: data.bed_count || 1,
    bathroom_count: data.bathroom_count || 1,
    guest_capacity: data.guest_capacity || 1,
  });

  const min = 1;
  const max = 20;

  useEffect(() => {
    // Verifica se a chave 'category' está presente em 'data' e se o valor é válido
    if (data.category) {
      const categoryIndex = labels.indexOf(data.category);
      if (categoryIndex !== -1) {
        setActiveButton(categoryIndex);
      }
    }

    // Atualiza os campos de contagem com base em 'counts'
    Object.keys(counts).forEach((key) => {
      updateFieldHandler({ target: { name: key, value: counts[key] } });
    });
  }, [data.category]);

  const handleChange = (key, value) => {
    const validValue = Math.max(min, Math.min(max, value));
    if (counts[key] !== validValue) {
      setCounts((prevCounts) => ({
        ...prevCounts,
        [key]: validValue,
      }));
      updateFieldHandler({ target: { name: key, value: validValue } });
    }
  };

  const increment = (key) => {
    handleChange(key, counts[key] + 1);
  };

  const decrement = (key) => {
    handleChange(key, counts[key] - 1);
  };

  const category =
    activeButton !== null
      ? translatedLabels[activeButton]
      : "Nenhuma categoria selecionada";

  return (
    <div className="userform-box">
      <div className="btn-form">
        <h2>Selecione o tipo de hospedagem</h2>
        <div className="btn-organization">
          {labels.map((label, index) => (
            <CustomButton
              key={index}
              icon={icons[index]}
              label={translatedLabels[index]}
              isActive={activeButton === index}
              onClick={() => {
                setActiveButton(index);
                updateFieldHandler({
                  target: { name: "category", value: label.toLowerCase() },
                });
              }}
            />
          ))}
        </div>
        <h2>Adicione informações básicas</h2>
        <div className="userform-box-input">
          {Object.keys(counts).map((key, index) => (
            <React.Fragment key={index}>
              <div className="userform-inputs">
                <div>
                  <label>{values[index]}</label>
                </div>
                <div className="cont-form">
                  <span type="button" onClick={() => decrement(key)}>
                    <PiMinusThin />
                  </span>
                  <input
                    type="number"
                    min={min}
                    max={max}
                    value={counts[key] || 1}
                    onChange={(e) => {
                      const newValue = Number(e.target.value);
                      if (!isNaN(newValue)) {
                        handleChange(key, newValue);
                      }
                    }}
                  />
                  <span type="button" onClick={() => increment(key)}>
                    <PiPlusThin />
                  </span>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step2;
