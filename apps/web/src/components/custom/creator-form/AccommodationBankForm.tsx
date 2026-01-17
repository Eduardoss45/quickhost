import { useState } from 'react';
import { BankForm } from '@/types';

const initialState: BankForm = {
  bank_name: '',
  account_holder: '',
  account_number: '',
  agency_code: '',
  account_type: '',
  cpf: '',
  validity: '',
  is_company_account: false,
};

export default function AccommodationBankForm() {
  const [bank, setBank] = useState<BankForm>(initialState);

  function updateField<K extends keyof BankForm>(key: K, value: BankForm[K]) {
    setBank(prev => ({ ...prev, [key]: value }));
  }

  // só para debug
  console.log('BANK FORM:', bank);

  return (
    <div>
      <h2>Dados bancários</h2>

      <input
        value={bank.bank_name}
        onChange={e => updateField('bank_name', e.target.value)}
        placeholder="Banco"
      />

      <input
        value={bank.account_holder}
        onChange={e => updateField('account_holder', e.target.value)}
        placeholder="Titular"
      />

      <input
        value={bank.account_number}
        onChange={e => updateField('account_number', e.target.value)}
        placeholder="Número da conta"
      />

      <input
        value={bank.agency_code}
        onChange={e => updateField('agency_code', e.target.value)}
        placeholder="Agência"
      />

      <select value={bank.account_type} onChange={e => updateField('account_type', e.target.value)}>
        <option value="">Selecione</option>
        <option value="corrente">Corrente</option>
        <option value="poupança">Poupança</option>
        <option value="depositos">Depósitos</option>
      </select>

      <input
        value={bank.cpf}
        onChange={e => updateField('cpf', e.target.value)}
        placeholder="CPF"
      />

      <input
        value={bank.validity}
        onChange={e => updateField('validity', e.target.value)}
        placeholder="Validade"
      />

      <label>
        <input
          type="checkbox"
          checked={bank.is_company_account}
          onChange={e => updateField('is_company_account', e.target.checked)}
        />
        Conta empresarial
      </label>
    </div>
  );
}
