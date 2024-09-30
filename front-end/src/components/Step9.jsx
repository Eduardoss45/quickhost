import React from "react";
import "./Step9.css";

const Step9 = ({ data, updateFieldHandler }) => {
  return (
    <div id="step-nine">
      <h1>Forneça seus dados bancários</h1>
      <p>Para finalizar, informe seus dados bancários para recebimento.</p>
      <div>
        <input
          type="text"
          name="bank_name"
          placeholder="Nome do Banco"
          value={data.bank_name || ""}
          onChange={updateFieldHandler}
        />

        <input
          type="text"
          name="account_holder"
          placeholder="Titular da conta"
          value={data.account_holder || ""}
          onChange={updateFieldHandler}
        />

        <input
          type="text"
          name="account_number"
          placeholder="Número da conta"
          value={data.account_number || ""}
          onChange={updateFieldHandler}
        />

        <input
          type="text"
          name="agency_code"
          placeholder="Código da agência"
          value={data.agency_code || ""}
          onChange={updateFieldHandler}
        />

        <div id="step-nine-inputs">
          <input
            type="text"
            name="account_type"
            placeholder="Tipo de conta"
            value={data.account_type || ""}
            onChange={updateFieldHandler}
          />

          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={data.cpf || ""}
            onChange={updateFieldHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default Step9;
