import {
  BsFillEmojiHeartEyesFill,
  BsFillEmojiSmileFill,
  BsFillEmojiNeutralFill,
  BsFillEmojiFrownFill,
} from 'react-icons/bs';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '@/schemas/accommodation-form.schema';

import { ReactElement } from 'react';

const emojiData: Record<FormValues['review'], ReactElement> = {
  unsatisfied: <BsFillEmojiFrownFill />,
  neutral: <BsFillEmojiNeutralFill />,
  satisfied: <BsFillEmojiSmileFill />,
  very_satisfied: <BsFillEmojiHeartEyesFill />,
};

const Thanks = () => {
  const { getValues } = useFormContext<FormValues>();
  const data = getValues();

  return (
    <div className="thanks-container">
      <h2>Falta pouco...</h2>

      <p>
        A sua opinião é muito importante, em breve você receberá um cupom de 10% de desconto para a
        sua próxima compra.
      </p>

      <p>Para concluir sua avaliação clique no botão de Enviar abaixo.</p>

      <h3>Aqui está o resumo da sua avaliação {data.name}:</h3>

      <p className="review-data">
        <span>Satisfação com o produto:</span>
        {data.review && emojiData[data.review]}
      </p>

      <p className="review-data">
        <span>Comentário:</span>
        {data.comment || '—'}
      </p>
    </div>
  );
};

export default Thanks;
