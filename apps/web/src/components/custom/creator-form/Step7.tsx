import React, { useState, useEffect } from 'react';

const Step7 = ({ updateFieldHandler, data }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [consecutiveDaysLimit, setConsecutiveDaysLimit] = useState('1');

  // Verificando se title, description e consecutive_days_limit estão em data e inicializando os estados
  useEffect(() => {
    if (data) {
      setTitle(data.title || ''); // Se title estiver em data, inicializa com ele
      setDescription(data.description || ''); // Se description estiver em data, inicializa com ele
      setConsecutiveDaysLimit(
        data.consecutive_days_limit === -1
          ? 'indeterminado'
          : String(data.consecutive_days_limit || '1')
      );
    }
  }, [data]);

  const handleTitleChange = e => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateFieldHandler({
      target: { name: 'title', value: newTitle },
    });
  };

  const handleDescriptionChange = e => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    updateFieldHandler({
      target: { name: 'description', value: newDescription },
    });
  };

  const handleDaysLimitChange = e => {
    const selectedValue = e.target.value;
    const newLimit = selectedValue === 'indeterminado' ? -1 : parseInt(selectedValue, 10);
    setConsecutiveDaysLimit(selectedValue);
    updateFieldHandler({
      target: { name: 'consecutive_days_limit', value: newLimit },
    });
  };

  return (
    <div>
      <h2>Descreva sua acomodação</h2>

      <h3>Título</h3>
      <div>
        <input
          type="text"
          placeholder="Digite o nome da acomodação"
          value={title}
          onChange={handleTitleChange}
        />
        <span>{title.length}/32</span>
      </div>

      <h3>Descrição</h3>
      <div>
        <textarea
          placeholder="Digite aqui sua descrição"
          value={description}
          onChange={handleDescriptionChange}
        ></textarea>
        <span>{description.length}/400</span>
      </div>

      <h3>Indique o número máximo de dias consecutivos em uma reserva</h3>
      <div>
        <select value={consecutiveDaysLimit} onChange={handleDaysLimitChange}>
          {[...Array(30).keys()].map(num => (
            <option key={num + 1} value={num + 1}>
              {num + 1}
            </option>
          ))}
          <option value="indeterminado">Indeterminado</option>
        </select>
      </div>
    </div>
  );
};

export default Step7;
