import "./css/Step9.css";

const Step9 = ({ data, bank, updateFieldHandler, updateFieldBankHandler }) => {
  const handleInputChange = (e) => {
    if (updateFieldHandler) updateFieldHandler(e);
    if (updateFieldBankHandler) {
      updateFieldBankHandler({
        target: { name: e.target.name, value: e.target.value },
      });
    }
  };

  const handleCheckboxChange = (e) => {
    if (updateFieldHandler) updateFieldHandler(e);
    if (updateFieldBankHandler) {
      updateFieldBankHandler({
        target: { name: e.target.name, value: e.target.checked },
      });
    }
  };

  return (
    <div className="step-nine">
      <h2>Informe seus dados bancários para recebimento.</h2>
      <div>
        <h3>Nome do banco</h3>
        <input
          type="text"
          name="bank_name"
          placeholder="Digite o nome do banco"
          value={bank.bank_name || data.bank_name || ""}
          onChange={handleInputChange}
        />

        <h3>Titular da conta</h3>
        <input
          type="text"
          name="account_holder"
          placeholder="Digite o nome do titular da conta"
          value={bank.account_holder || data.account_holder || ""}
          onChange={handleInputChange}
        />

        <h3>Número da conta</h3>
        <input
          type="number"
          name="account_number"
          placeholder="Digite o número da sua conta"
          value={bank.account_number || data.account_number || ""}
          onChange={handleInputChange}
        />

        <h3>Código da agência</h3>
        <input
          type="number"
          name="agency_code"
          placeholder="Digite o código da agência"
          value={bank.agency_code || data.agency_code || ""}
          onChange={handleInputChange}
        />

        <h3>Tipo de conta</h3>
        <select
          name="account_type"
          value={bank.account_type || data.account_type || ""}
          onChange={handleInputChange}
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
          value={bank.cpf || data.cpf || ""}
          onChange={handleInputChange}
        />

        <h3>CVV</h3>
        <input
          type="text"
          name="validity"
          placeholder="1/24"
          value={bank.validity || data.validity || ""}
          onChange={handleInputChange}
        />

        <div className="check-box">
          <h3>Conta Empresarial</h3>
          <input
            type="checkbox"
            name="is_company_account"
            checked={
              bank.is_company_account || data.is_company_account || false
            }
            onChange={handleCheckboxChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Step9;
