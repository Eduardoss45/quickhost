import React, { useState, useEffect } from 'react';
import { MdBedroomParent } from 'react-icons/md';
import { FaHouse } from 'react-icons/fa6';


const Step3 = ({ data, updateFieldHandler }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setSelectedOption(data.space_type || null);
  }, [data.space_type]);

  const handleSelection = option => {
    setSelectedOption(option);
    updateFieldHandler({
      target: { name: 'space_type', value: option },
    });
  };

  return (
    <div>
      <h2>Selecione o tipo de espaço</h2>
      <div>
        <div onClick={() => handleSelection('full_space')}>
          <h2>Espaço inteiro</h2>
          <div>
            <p>Uma acomodação completa para seus hóspedes</p>
            <span>
              <FaHouse />
            </span>
          </div>
        </div>
        <div onClick={() => handleSelection('limited_space')}>
          <h2>Quarto</h2>
          <div>
            <p>Direito a um quarto exclusivo e acesso a áreas compartilhadas</p>
            <span>
              <MdBedroomParent />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;
