import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import './css/SeletorData.css';

const SeletorData = ({ onDateChange, pricePerDay }) => {
  const [checkinDate, setCheckinDate] = useState(null);
  const [checkoutDate, setCheckoutDate] = useState(null);
  const [editDate, setEditDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const today = new Date();

  const handleDateClick = (dateType) => {
    setEditDate(dateType);
    setErrorMessage("");
    setIsVisible(true);
  };

  const calculateTotalPriceAndTax = (checkIn, checkOut, price) => {
    const daysDifference = Math.ceil(
      (checkOut - checkIn) / (1000 * 60 * 60 * 24)
    );
    if (daysDifference < 1) return { total: 0, tax: 0 };

    let taxRate = 1.05;
    if (daysDifference > 3 && daysDifference <= 7) {
      taxRate = 1.1;
    } else if (daysDifference > 7) {
      taxRate = 1.15;
    }

    const totalPrice = price * daysDifference * taxRate;
    const taxValue = totalPrice - price * daysDifference;
    return { total: totalPrice.toFixed(2), tax: taxValue.toFixed(2) };
  };

  const handleDatePickerChange = (date) => {
    if (date < today) {
      setErrorMessage("A data não pode ser anterior ao dia de hoje");
      return;
    }

    if (editDate === "checkin") {
      if (checkoutDate && date >= checkoutDate) {
        setErrorMessage(
          "A data de Check-in não pode ser igual ou depois de Check-out"
        );
        return;
      }
      setCheckinDate(date);
      if (checkoutDate) {
        const { total, tax } = calculateTotalPriceAndTax(
          date,
          checkoutDate,
          pricePerDay
        );
        onDateChange(date, checkoutDate, total, tax);
      }
    } else if (editDate === "checkout") {
      if (checkinDate && date <= checkinDate) {
        setErrorMessage(
          "A data de Check-out não pode ser igual ou antes de Check-in"
        );
        return;
      }
      setCheckoutDate(date);
      if (checkinDate) {
        const { total, tax } = calculateTotalPriceAndTax(
          checkinDate,
          date,
          pricePerDay
        );
        onDateChange(checkinDate, date, total, tax);
      }
    }

    if (checkinDate && checkoutDate) {
      setIsVisible(false);
    }
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

      {isVisible && (editDate === "checkin" || editDate === "checkout") && (
        <DatePicker
          selected={editDate === "checkin" ? checkinDate : checkoutDate}
          onChange={handleDatePickerChange}
          inline
          calendarClassName={`custom-calendar`}
          locale={ptBR}
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

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default SeletorData;
