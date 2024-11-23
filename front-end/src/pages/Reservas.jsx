import CardReservas from "../components/CardReservas";
import CardCancelarReservas from "../components/CardCancelarReservas";
import "./Reservas.css";
const Reservas = () => {
  return (
    <div className="pagina-reservas">
      <h2>Minhas Reservas</h2>
      <CardReservas />
      <div className="reservas-texto-alternativo">
        <p>
          Parece que você não tem nenhuma reserva ativa... procure uma ao seu
          gosto na página inicial
        </p>
      </div>
      <CardCancelarReservas />
      {/* criar condicional para gerenciar a visualização desses componentes */}
    </div>
  );
};

export default Reservas;
