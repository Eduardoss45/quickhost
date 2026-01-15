import {
  BsFillEmojiHeartEyesFill,
  BsFillEmojiSmileFill,
  BsFillEmojiNeutralFill,
  BsFillEmojiFrownFill,
} from 'react-icons/bs';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '@/schemas/accommodation-form.schema';

const ReviewForm = () => {
  const { register, watch } = useFormContext<FormValues>();
  const selectedReview = watch('review');
  const getClass = (value: FormValues['review']) => {
    return selectedReview === value ? 'emoji active' : 'emoji';
  };

  return (
    <div className="review-form">
      <div className="form-control score-container">
        <label className="radio-container">
          <input type="radio" value="unsatisfied" {...register('review')} />
          <BsFillEmojiFrownFill className={getClass('unsatisfied')} />
          <p>Insatisfeito</p>
        </label>
        <label className="radio-container">
          <input type="radio" value="neutral" {...register('review')} />
          <BsFillEmojiNeutralFill className={getClass('neutral')} />
          <p>Poderia ser melhor</p>
        </label>
        <label className="radio-container">
          <input type="radio" value="satisfied" {...register('review')} />
          <BsFillEmojiSmileFill className={getClass('satisfied')} />
          <p>Satisfeito</p>
        </label>
        <label className="radio-container">
          <input type="radio" value="very_satisfied" {...register('review')} />
          <BsFillEmojiHeartEyesFill className={getClass('very_satisfied')} />
          <p>Muito satisfeito</p>
        </label>
      </div>
      <div className="form-control">
        <label htmlFor="comment">Comnetário:</label>
        <textarea
          id="comment"
          placeholder="Conte como foi a sua experência com o produto..."
          {...register('comment')}
        ></textarea>
      </div>
    </div>
  );
};

export default ReviewForm;
