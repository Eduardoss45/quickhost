import React from "react";
import "./css/Step9.css";

const Step9 = ({ data, updateFieldHandler }) => {
  return (
    <div className="step-nine">
      <h2>Informe seus dados bancários para recebimento.</h2>
      <div>
        <h3>Nome do banco</h3>
        <input
          type="text"
          name="bank_name"
          placeholder="Digite o nome do banco"
          value={data.bank_name || ""}
          onChange={updateFieldHandler}
        />

        <h3>Titular da conta</h3>
        <input
          type="text"
          name="account_holder"
          placeholder="Digite o nome do titular da conta"
          value={data.account_holder || ""}
          onChange={updateFieldHandler}
        />

        <h3>Número da conta</h3>
        <input
          type="text"
          name="account_number"
          placeholder="Digite o número da sua conta"
          value={data.account_number || ""}
          onChange={updateFieldHandler}
        />

        <h3>Código da agência</h3>
        <input
          type="text"
          name="agency_code"
          placeholder="Digite o código da agência"
          value={data.agency_code || ""}
          onChange={updateFieldHandler}
        />

        <h3>Tipo de conta</h3>
        <select
          name="account_type"
          value={data.account_type || ""}
          onChange={updateFieldHandler}
        >
          <option value="">Selecione</option>
          <option value="corrente">Corrente</option>
          <option value="poupança">Poupança</option>
          <option value="depositos">Depósitos</option>
        </select>

        <h3>CPF</h3>
        <input
          type="text"
          name="cpf"
          placeholder="000.000.000-00"
          value={data.cpf || ""}
          onChange={updateFieldHandler}
        />
      </div>
    </div>
  );
};

export default Step9;
