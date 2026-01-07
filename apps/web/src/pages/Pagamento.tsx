import { PiArrowCircleLeftThin } from "react-icons/pi";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import useAccommodation from "../hooks/useAccommodation";
import './css/Pagamento.css';

const Pagamento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { accommodationData } = useAccommodation(id);
  const formData = location.state;
  const handleNext = () => {
    navigate(`/form/${id}`, { state: { formData, accommodationData } });
  };
  function formatDateRange(startDate, endDate = null) {
    const months = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];
    const formatSingleDate = (date) => {
      const [year, month, day] = date.split("-");
      return `${parseInt(day, 10)} de ${months[parseInt(month, 10) - 1]}`;
    };
    if (!endDate) {
      return formatSingleDate(startDate);
    }
    const [startYear, startMonth, startDay] = startDate.split("-");
    const [endYear, endMonth, endDay] = endDate.split("-");
    const sameMonth = startMonth === endMonth && startYear === endYear;
    if (sameMonth) {
      return `${parseInt(startDay, 10)}-${parseInt(endDay, 10)} de ${
        months[parseInt(startMonth, 10) - 1]
      }`;
    } else {
      return `${formatSingleDate(startDate)} a ${formatSingleDate(endDate)}`;
    }
  }
  return (
    <div className="pagamento-card">
      <div className="card-primario">
        <div>
          <Link to="/">
            <span>
              <PiArrowCircleLeftThin />
            </span>
          </Link>
          <div>
            <h2>Revisar Informações</h2>
            <p>{accommodationData?.title}</p>
          </div>
        </div>
        <div>
          <h3>Sua reserva</h3>
          <p>
            {formatDateRange(formData?.check_in_date, formData?.check_out_date)}
          </p>
        </div>
        <div>
          <h3>Check-in e check-out</h3>
          <p>{formatDateRange(formData?.check_in_date)} a partir das 14h</p>
          <p>{formatDateRange(formData?.check_out_date)} a partir das 12h</p>
        </div>
        <div>
          <h3>Política de cancelamento</h3>
          <p>
            O reembolso só será possível caso o cancelamento seja efetuado 7
            dias antes da reserva. Após o prazo será cobrado uma taxa de 10% do
            preço da acomodação.
          </p>
          <button onClick={handleNext}>Próximo</button>
        </div>
      </div>
      <div>
        <img
          src={`${import.meta.env.VITE_BASE_URL}${
            accommodationData?.main_cover_image
          }`}
          alt="A imagem principal não foi definida pelo anfitrião"
        />
      </div>
    </div>
  );
};

export default Pagamento;
