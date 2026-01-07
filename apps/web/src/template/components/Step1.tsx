import { PiNumberCircleOneThin } from "react-icons/pi";
import { PiNumberCircleTwoThin } from "react-icons/pi";
import { PiNumberCircleThreeThin } from "react-icons/pi";
import card_1 from "../../image/card-1.png";
import card_2 from "../../image/card-2.png";
import card_3 from "../../image/card-3.png";
import "./css/Step1.css";

const Step1 = () => {
  return (
    <div className="quick-host-container">
      <div>
        <PiNumberCircleOneThin />
        <div className="step-1-linha">
          <div></div>
        </div>
        <PiNumberCircleTwoThin />
        <div className="step-1-linha">
          <div></div>
        </div>
        <PiNumberCircleThreeThin />
      </div>
      <div className="steps-container">
        <Step
          altText="Texto representando uma vista aérea de uma casa"
          image={card_1}
        />
        <Step
          altText="Texto representando um edifício com varandas cobertas por plantas"
          image={card_2}
        />
        <Step
          altText="Texto representando uma casa grande com visitantes na frente"
          image={card_3}
        />
      </div>
    </div>
  );
};

const Step = ({ altText, image }) => {
  return (
    <div className="step">
      <img className="step-image" src={image} alt={altText} />
    </div>
  );
};

export default Step1;
