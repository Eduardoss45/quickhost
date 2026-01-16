import { PiNumberCircleOneThin } from 'react-icons/pi';
import { PiNumberCircleTwoThin } from 'react-icons/pi';
import { PiNumberCircleThreeThin } from 'react-icons/pi';
import card_1 from '@/image/card-1.png';
import card_2 from '@/image/card-2.png';
import card_3 from '@/image/card-3.png';

const Step1 = () => {
  return (
    <div>
      <div className="flex flex-row items-center gap-2 justify-center">
        <span className="text-6xl">
          <PiNumberCircleOneThin />
        </span>
        <div>
          <div className="border-b border w-full min-w-100"></div>
        </div>
        <span className="text-6xl">
          <PiNumberCircleTwoThin />
        </span>
        <div>
          <div className="border-b border w-full min-w-100"></div>
        </div>
        <span className="text-6xl">
          <PiNumberCircleThreeThin />
        </span>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <Step altText="Texto representando uma vista aérea de uma casa" image={card_1} />
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
    <div>
      <img src={image} alt={altText} />
    </div>
  );
};

export default Step1;
