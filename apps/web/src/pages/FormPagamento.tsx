import { PiArrowCircleLeftThin } from 'react-icons/pi';
import { GoCreditCard } from 'react-icons/go';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import useAccommodation from '../hooks/useAccommodation';
import useBooking from '../hooks/useBooking';
import useUserData from '../hooks/useUserData';
import { useState } from 'react';

const FormPagamento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { accommodationData } = useAccommodation(id);
  const { userData } = useUserData();
  const { bookAccommodation, error: bookingError, success: bookingSuccess } = useBooking();

  const formData = location.state;
  const checkIn = formData.formData.check_in_date;
  const checkOut = formData.formData.check_out_date;
  const price = formData.formData.price;

  const calculateTotalPriceAndTax = (checkIn, checkOut, price) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      throw new Error('Datas inválidas fornecidas.');
    }
    const daysDifference = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (daysDifference < 1) return { total: 0, tax: 0 };
    let taxRate = 1.05;
    if (daysDifference > 3 && daysDifference <= 7) {
      taxRate = 1.1;
    } else if (daysDifference > 7) {
      taxRate = 1.15;
    }
    const totalPrice = price * daysDifference * taxRate;
    const amount = price * taxRate;
    return { total: totalPrice.toFixed(2), amount: amount.toFixed(2) };
  };

  const basePrice = calculateTotalPriceAndTax(checkIn, checkOut, price);

  const [formTemplate, setFormTemplate] = useState({
    account_holder: '',
    account_number: '',
    validity: '',
    agency_code: '',
    account_type: '',
    is_company_account: false,
    address: '',
    neighborhood: '',
    city: '',
    uf: '',
    postal_code: '',
    parcel: 1,
    amount: '',
    from_account: '',
    to_account: '',
    accommodation: '',
    user_account: '',
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormTemplate(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleNext = () => {
    bookAccommodation(formData.formData);
    navigate(`/finalizacao/${id}`, {
      state: true,
    });
  };

  return (
    <div>
      <div>
        <div>
          <Link to="/">
            <span>
              <PiArrowCircleLeftThin />
            </span>
          </Link>
          <div>
            <h2>Pagar</h2>
            <p>{accommodationData?.title}</p>
          </div>
        </div>
        <form >
          <div>
            <h2>Método de pagamento</h2>
            <div >
              <GoCreditCard />
              <span>Cartão de Crédito</span>
            </div>
          </div>
          <div >
            <h2>Método de pagamento</h2>
            <div>
              <h3>Nome do titular</h3>
              <input
                type="text"
                name="account_holder"
                placeholder="Digite o nome presente na parte da frente do cartão"
                value={formTemplate.account_holder}
                onChange={handleChange}
              />
              <h3>Número do cartão</h3>
              <input
                type="text"
                name="account_number"
                placeholder="0000 0000 0000 0000"
                value={formTemplate.account_number}
                onChange={handleChange}
              />
              <h3>Validade</h3>
              <input
                type="text"
                name="validity"
                placeholder="MM/AA"
                value={formTemplate.validity}
                onChange={handleChange}
              />
              <h3>CVV</h3>
              <input
                type="text"
                name="agency_code"
                placeholder="Digite os três dígitos de segurança presente na parte de trás do cartão"
                value={formTemplate.agency_code}
                onChange={handleChange}
              />
              <h3>Tipo de conta</h3>
              <select
                name="account_type"
                value={formTemplate.account_type || ''}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="corrente">Corrente</option>
                <option value="poupança">Poupança</option>
                <option value="depositos">Depósitos</option>
              </select>
              <h3>Parcela</h3>
              <select name="parcel" value={formTemplate.parcel} onChange={handleChange}>
                {[...Array(12)].map((_, index) => {
                  const numeroParcelas = index + 1;
                  const valorParcela = (basePrice.total / numeroParcelas)
                    .toFixed(2)
                    .replace('.', ',');
                  return (
                    <option key={numeroParcelas} value={numeroParcelas}>
                      {`${numeroParcelas}x de ${valorParcela} sem juros`}
                    </option>
                  );
                })}
              </select>
              <div>
                <h3>Conta Empresarial</h3>
                <input
                  type="checkbox"
                  name="is_company_account"
                  checked={formTemplate.is_company_account}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div>
            <h2>Endereço de cobrança</h2>
            <div>
              <h3>Endereço</h3>
              <input
                type="text"
                name="address"
                placeholder="Digite o seu endereço"
                value={formTemplate.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <h3>Bairro/Distrito</h3>
              <input
                type="text"
                name="neighborhood"
                placeholder="Digite o seu bairro/distrito"
                value={formTemplate.neighborhood}
                onChange={handleChange}
              />
            </div>
            <div>
              <h3>Cidade</h3>
              <input
                type="text"
                name="city"
                placeholder="Digite a sua cidade"
                value={formTemplate.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <h3>UF</h3>
              <input
                type="text"
                name="uf"
                placeholder="Digite o seu estado/província"
                value={formTemplate.uf}
                onChange={handleChange}
              />
            </div>
            <div>
              <h3>CEP</h3>
              <input
                type="text"
                name="postal_code"
                placeholder="Digite o seu CEP"
                value={formTemplate.postal_code}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
        <button onClick={handleNext}>Finalizar pagamento</button>
      </div>
      <div>
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${accommodationData?.main_cover_image}`}
          alt="A imagem principal não foi definida pelo anfitrião"
        />
      </div>
    </div>
  );
};

export default FormPagamento;
