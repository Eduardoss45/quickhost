import CardReservas from "../components/CardReservas";
import CardCancelarReservas from "../components/CardCancelarReservas";
import useUserData from "../hooks/useUserData";
import "./Reservas.css";

const Reservas = () => {
  const { userData } = useUserData();
  const reservas = userData?.registered_bookings;
  return (
    <div className="pagina-reservas">
      <h2>Minhas Reservas</h2>
      {reservas && reservas.length > 0 ? (
        reservas.map((reserva, index) => (
          <CardReservas key={index} reserva={reserva} />
        ))
      ) : (
        <div className="reservas-texto-alternativo">
          <p>
            Parece que você não tem nenhuma reserva ativa... procure uma ao seu
            gosto na página inicial.
          </p>
        </div>
      )}
      <CardCancelarReservas />
    </div>
  );
};

export default Reservas;
