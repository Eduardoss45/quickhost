import "./Step9.css";

const Step9 = () => {
  return (
    <div id="step-nine">
      <h1>Forneça seus dados bancários</h1>
      <p>Para finalizar, informe seus dados bancários para recebimento.</p>
      <div>
        <input type="text" placeholder="Nome do Banco" />
        <input type="text" placeholder="Títular da conta" />
        <input type="text" placeholder="Número da conta" />
        <input type="text" placeholder="Código da agência" />
        <div id="step-nine-inputs">
          <input type="text" placeholder="Tipo de conta" />
          <input type="text" placeholder="CPF" />
        </div>
      </div>
    </div>
  );
};

export default Step9;
