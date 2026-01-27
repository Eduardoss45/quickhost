import { useState } from 'react';
import type { BankForm } from '@/types';

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

type BankErrors = Partial<Record<keyof BankForm, string>>;

export default function AccommodationBankForm() {
  const [bank, setBank] = useState<BankForm>(initialState);
  const [errors, setErrors] = useState<BankErrors>({});

  function updateField<K extends keyof BankForm>(key: K, value: BankForm[K]) {
    setBank(prev => ({ ...prev, [key]: value }));

    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  }

  function validate() {
    const nextErrors: BankErrors = {};

    if (!bank.bank_name) nextErrors.bank_name = 'Banco obrigatório';
    if (!bank.account_holder) nextErrors.account_holder = 'Titular obrigatório';
    if (!bank.account_number) nextErrors.account_number = 'Número da conta obrigatório';
    if (!bank.agency_code) nextErrors.agency_code = 'Agência obrigatória';
    if (!bank.account_type) nextErrors.account_type = 'Tipo de conta obrigatório';
    if (!bank.cpf || bank.cpf.length < 11) nextErrors.cpf = 'CPF inválido';
    if (!bank.validity) nextErrors.validity = 'Validade obrigatória';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  return (
    <div className="flex flex-col max-w-xl">
      <h2 className="text-2xl mb-4">Dados bancários</h2>

      <div
        className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
        role="alert"
      >
        <p className="font-bold">Atenção</p>
        <p>
          Nenhum destes dados financeiros tem propósito real. Este formulário faz parte apenas de
          uma etapa de fluxo e não tem uso prático na criação da acomodação. Por favor,{' '}
          <strong>não preencha com dados reais</strong>. Use apenas informações fictícias ou
          genéricas. Esta etapa pode ser pulada se desejar.
        </p>
      </div>

      <h2 className="text-2xl mb-4">Dados bancários</h2>

      <input
        value={bank.bank_name}
        onChange={e => updateField('bank_name', e.target.value)}
        placeholder="Banco"
        className={`border outline-none p-2 rounded-md my-2 ${
          errors.bank_name ? 'border-red-500' : ''
        }`}
      />
      {errors.bank_name && <p className="text-sm text-red-500 -mt-1 mb-2">{errors.bank_name}</p>}

      <input
        value={bank.account_holder}
        onChange={e => updateField('account_holder', e.target.value)}
        placeholder="Titular"
        className={`border outline-none p-2 rounded-md my-2 ${
          errors.account_holder ? 'border-red-500' : ''
        }`}
      />
      {errors.account_holder && (
        <p className="text-sm text-red-500 -mt-1 mb-2">{errors.account_holder}</p>
      )}

      <input
        value={bank.account_number}
        onChange={e => updateField('account_number', e.target.value)}
        placeholder="Número da conta"
        className={`border outline-none p-2 rounded-md my-2 ${
          errors.account_number ? 'border-red-500' : ''
        }`}
      />
      {errors.account_number && (
        <p className="text-sm text-red-500 -mt-1 mb-2">{errors.account_number}</p>
      )}

      <input
        value={bank.agency_code}
        onChange={e => updateField('agency_code', e.target.value)}
        placeholder="Agência"
        className={`border outline-none p-2 rounded-md my-2 ${
          errors.agency_code ? 'border-red-500' : ''
        }`}
      />
      {errors.agency_code && (
        <p className="text-sm text-red-500 -mt-1 mb-2">{errors.agency_code}</p>
      )}

      <select
        value={bank.account_type}
        onChange={e => updateField('account_type', e.target.value)}
        className={`border outline-none p-2 rounded-md my-2 ${
          errors.account_type ? 'border-red-500' : ''
        }`}
      >
        <option value="">Selecione</option>
        <option value="corrente">Corrente</option>
        <option value="poupança">Poupança</option>
        <option value="depositos">Depósitos</option>
      </select>
      {errors.account_type && (
        <p className="text-sm text-red-500 -mt-1 mb-2">{errors.account_type}</p>
      )}

      <input
        value={bank.cpf}
        onChange={e => updateField('cpf', e.target.value)}
        placeholder="CPF"
        className={`border outline-none p-2 rounded-md my-2 ${errors.cpf ? 'border-red-500' : ''}`}
      />
      {errors.cpf && <p className="text-sm text-red-500 -mt-1 mb-2">{errors.cpf}</p>}

      <input
        value={bank.validity}
        onChange={e => updateField('validity', e.target.value)}
        placeholder="Validade"
        className={`border outline-none p-2 rounded-md my-2 ${
          errors.validity ? 'border-red-500' : ''
        }`}
      />
      {errors.validity && <p className="text-sm text-red-500 -mt-1 mb-2">{errors.validity}</p>}

      <label className="flex items-center gap-2 mt-3">
        <input
          type="checkbox"
          checked={bank.is_company_account}
          onChange={e => updateField('is_company_account', e.target.checked)}
          className="scale-150"
        />
        Conta empresarial
      </label>
    </div>
  );
}
