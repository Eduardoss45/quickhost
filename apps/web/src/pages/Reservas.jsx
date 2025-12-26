import CardReservas from "../components/CardReservas";
import "./Reservas.css";

const Reservas = ({userData}) => {
  const reservas = userData?.registered_accommodation_bookings;
  return (
    <div className="pagina-reservas">
      <h2>Minhas Reservas</h2>
      {reservas && reservas.length > 0 ? (
        reservas.map((reserva, index) => (
          <CardReservas
            key={index}
            userName={userData?.username}
            reserva={reserva}
          />
        ))
      ) : (
        <div className="reservas-texto-alternativo">
          <p>
            Parece que você não tem nenhuma reserva ativa... procure uma ao seu
            gosto na página inicial.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reservas;
