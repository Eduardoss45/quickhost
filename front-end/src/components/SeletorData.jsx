import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale"; // Localizador em português
import "./SeletorData.css";

const SeletorData = ({ onDateChange }) => {
  const [checkinDate, setCheckinDate] = useState(null); // Estado para Check-in
  const [checkoutDate, setCheckoutDate] = useState(null); // Estado para Check-out
  const [editDate, setEditDate] = useState(null); // Para controlar se estamos editando check-in ou check-out
  const [errorMessage, setErrorMessage] = useState(""); // Estado para armazenar a mensagem de erro
  const [isVisible, setIsVisible] = useState(true); // Estado para controlar a visibilidade do seletor de data (inicialmente, o seletor está visível)

  const today = new Date(); // Data atual

  const handleDateClick = (dateType) => {
    setEditDate(dateType); // Define qual data será editada (check-in ou check-out)
    setErrorMessage(""); // Limpa a mensagem de erro ao abrir o seletor
    setIsVisible(true); // Reabre o seletor de data sempre que clicar em uma caixa
  };

  const handleDatePickerChange = (date) => {
    // Verifica se a data é anterior à data atual
    if (date < today) {
      setErrorMessage("A data não pode ser anterior ao dia de hoje");
      return; // Não atualiza a data se for inválida
    }

    if (editDate === "checkin") {
      // Verifica se a data de check-in é posterior ou igual ao checkout
      if (checkoutDate && date >= checkoutDate) {
        setErrorMessage(
          "A data de Check-in não pode ser igual ou depois de Check-out"
        );
        return; // Não atualiza o Check-in se for inválido
      }
      setCheckinDate(date); // Atualiza a data de check-in
      onDateChange(date, checkoutDate); // Passa as duas datas para o componente pai
    } else if (editDate === "checkout") {
      // Verifica se a data de checkout é antes ou igual ao checkin
      if (checkinDate && date <= checkinDate) {
        setErrorMessage(
          "A data de Check-out não pode ser igual ou antes de Check-in"
        );
        return; // Não atualiza o Check-out se for inválido
      }
      setCheckoutDate(date); // Atualiza a data de check-out
      onDateChange(checkinDate, date); // Passa as duas datas para o componente pai
    }

    // Fecha o seletor de data quando ambas as datas forem selecionadas
    if (checkinDate && checkoutDate) {
      setIsVisible(false); // Fecha o seletor de data
    }
  };

  // Função para comparar as datas completas (ano, mês e dia)
  const isSelectedDate = (date) => {
    if (editDate === "checkin" && checkinDate) {
      return date.getTime() === checkinDate.getTime(); // Compara as datas completas de Check-in
    }
    if (editDate === "checkout" && checkoutDate) {
      return date.getTime() === checkoutDate.getTime(); // Compara as datas completas de Check-out
    }
    return false;
  };

  return (
    <div className="calendar-container">
      <div>
        <div
          className="acomodacao-date-item"
          onClick={() => handleDateClick("checkin")}
        >
          <span>Check-in</span>
          <p>
            {checkinDate
              ? checkinDate.toLocaleDateString("pt-BR")
              : "Clique para selecionar"}
          </p>
        </div>
        <div
          className="acomodacao-date-item"
          onClick={() => handleDateClick("checkout")}
        >
          <span>Check-out</span>
          <p>
            {checkoutDate
              ? checkoutDate.toLocaleDateString("pt-BR")
              : "Clique para selecionar"}
          </p>
        </div>
      </div>

      {/* Seletor de data - será ocultado quando ambas as datas forem selecionadas */}
      {isVisible && (editDate === "checkin" || editDate === "checkout") && (
        <DatePicker
          selected={editDate === "checkin" ? checkinDate : checkoutDate} // Define a data selecionada com base no tipo de data
          onChange={handleDatePickerChange}
          inline
          calendarClassName={`custom-calendar`}
          dayClassName={(date) =>
            isSelectedDate(date) ? "custom-selected-day" : ""
          }
          locale={ptBR} // Define o localizador em português do Brasil
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="custom-header">
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="nav-button"
              >
                &lt;
              </button>
              <span className="current-month">
                {date.toLocaleString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="nav-button"
              >
                &gt;
              </button>
            </div>
          )}
        />
      )}

      {/* Mensagem de erro */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default SeletorData;
