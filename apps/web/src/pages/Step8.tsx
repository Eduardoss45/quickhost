import React, { useState, useEffect } from "react";
import "./css/Step8.css";

const Step8 = ({ updateFieldHandler, data }) => {
  const [pricePerNight, setPricePerNight] = useState("");
  const [cleaningFee, setCleaningFee] = useState("");
  const [discount, setDiscount] = useState(false);

  // Verificando se os valores estão presentes em data e inicializando os estados
  useEffect(() => {
    if (data) {
      setPricePerNight(data.price_per_night || "");
      setCleaningFee(data.cleaning_fee || "");
      setDiscount(data.discount || false);
    }
  }, [data]);

  const handlePriceChange = (e) => {
    const newPrice = parseFloat(e.target.value) || 0;
    if (newPrice >= 0) {
      setPricePerNight(newPrice);
      updateFieldHandler({
        target: { name: "price_per_night", value: newPrice },
      });
    }
  };

  const handleCleaningFee = (e) => {
    const newCleaningFee = parseFloat(e.target.value) || 0;
    if (newCleaningFee >= 0) {
      setCleaningFee(newCleaningFee);
      updateFieldHandler({
        target: { name: "cleaning_fee", value: newCleaningFee },
      });
    }
  };

  const handleDiscountChange = (e) => {
    const isChecked = e.target.checked;
    setDiscount(isChecked);
    updateFieldHandler({
      target: { name: "discount", value: isChecked },
    });
  };

  return (
    <div >
      <h2>Determine o valor da sua diária</h2>
      <h3>Valor</h3>
      <div >
        <strong>
          R$
          <input
            type="number"
            value={pricePerNight}
            onChange={handlePriceChange}
            placeholder="0,00"
            min="50"
          />
        </strong>
      </div>
      <p>
        * Será cobrada uma taxa de serviço de 10% sobre o valor da acomodação.
      </p>

      <h2>Determine a taxa de limpeza</h2>
      <h3>Valor</h3>
      <div>
        <strong>
          R$
          <input
            type="number"
            value={cleaningFee}
            onChange={handleCleaningFee}
            placeholder="0,00"
            min="10"
          />
        </strong>
      </div>

      <h2>Selecione um desconto</h2>
      <div>
        <input
          type="checkbox"
          checked={discount}
          onChange={handleDiscountChange}
        />
        <div>
          <span>Novos anúncios</span>
          <p>Desconto de 20% em sua primeira reserva</p>
        </div>
      </div>
    </div>
  );
};

export default Step8;
