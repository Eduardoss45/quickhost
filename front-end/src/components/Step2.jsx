import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { LiaUmbrellaBeachSolid } from "react-icons/lia";
import { MdBedroomParent, MdChalet } from "react-icons/md";
import { FaBuilding, FaHouse } from "react-icons/fa6";
import CustomButton from "./CustomButton";
import "./Step2.css";

const Step2 = ({ data, updateFieldHandler }) => {
  const labels = ["inn", "chalet", "apartment", "home", "room"];
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

  const handleChange = (key, value) => {
    const validValue = Math.max(min, Math.min(max, value));
    if (counts[key] !== validValue) {
      console.log(`Atualizando ${key} de ${counts[key]} para ${validValue}`); // Log de alteração
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
      ? labels[activeButton]
      : "Nenhuma categoria selecionada";

  return (
    <div id="userform-box">
      <h1>Qual das seguintes opções descreve melhor seu espaço?</h1>
      <div id="btn-form">
        <div id="btn-organization">
          {labels.map((label, index) => (
            <CustomButton
              key={index}
              icon={icons[index]}
              label={label}
              isActive={activeButton === index}
              onClick={() => {
                console.log(`Categoria selecionada: ${label}`); // Log ao selecionar categoria
                setActiveButton(index);
                updateFieldHandler({
                  target: { name: "category", value: label.toLowerCase() },
                });

                // Log para mostrar o resultado final após a atualização
                console.log("Dados atualizados:", {
                  ...data,
                  category: label.toLowerCase(), // Atualiza a categoria no objeto data
                });
              }}
            />
          ))}
        </div>
        <h2>Adicione informações básicas</h2>
        <div id="userform-box-input">
          {Object.keys(counts).map((key, index) => (
            <React.Fragment key={index}>
              <div className="userform-inputs">
                <div>
                  <label>{values[index]}</label>
                </div>
                <div className="cont-form">
                  <span type="button" onClick={() => decrement(key)}>
                    <FaMinus />
                  </span>
                  <input
                    type="number"
                    min={min}
                    max={max}
                    value={counts[key] || 1}
                    onChange={(e) => {
                      const newValue = Number(e.target.value);
                      console.log(`Campo ${key} alterado para ${newValue}`); // Log adicionado
                      if (!isNaN(newValue)) {
                        handleChange(key, newValue);
                      }
                    }}
                  />
                  <span type="button" onClick={() => increment(key)}>
                    <FaPlus />
                  </span>
                </div>
              </div>
              <div className="userform-line"></div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step2;
