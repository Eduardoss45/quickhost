import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import "./Step8.css";

const Step8 = ({ updateFieldHandler }) => {
  const [pricePerNight, setPricePerNight] = useState("");

  const handlePriceChange = (e) => {
    const newPrice = parseFloat(e.target.value); // Converte o valor para número
    setPricePerNight(newPrice);
    updateFieldHandler({
      target: { name: "price_per_night", value: newPrice },
    });
  };

  return (
    <div id="step-eight">
      <h2>Determine o preço de sua diária</h2>
      <p>Você poderá fazer alterações depois.</p>
      <div id="step-eight-preco">
        <strong>
          <input
            type="number"
            value={pricePerNight}
            onChange={handlePriceChange}
            placeholder="Preço"
          />
          R$
          <span>
            <CiEdit />
          </span>
        </strong>
      </div>
      <p>Será adicionado 10% de taxa sobre o valor exibido para os hóspedes.</p>
      <h2>Selecione um desconto</h2>
      <p>Destaque sua acomodação para receber reservas mais rapidamente.</p>
      <div className="cupom-desconto">
        <strong>20%</strong>
        <div>
          <span>Novos anúncios</span>
          <p>Desconto de 20% em sua primeira reserva</p>
        </div>
        <input type="checkbox" />
      </div>
    </div>
  );
};

export default Step8;
