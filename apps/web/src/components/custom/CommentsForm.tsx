import { useState } from 'react';
import { IoStarSharp } from 'react-icons/io5';

interface Props {
  onSubmit: (data: { content: string; rating: number }) => void;
  disabled?: boolean;
}

export default function CommentsForm({ onSubmit, disabled }: Props) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (!content || rating === 0) return;

    onSubmit({ content, rating });
    setContent('');
    setRating(0);
  };

  return (
    <div className="border rounded-lg p-4 my-4 mb-6 flex flex-col">
      <div className="flex justify-between">
        <h3 className="font-semibold mb-2">Deixe seu comentário</h3>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(value => (
            <button key={value} type="button" onClick={() => setRating(value)} className="text-xl">
              <IoStarSharp
                className={value <= rating ? 'text-yellow-500' : 'text-muted-foreground'}
              />
            </button>
          ))}
        </div>
      </div>
      <textarea
        className="w-full border rounded-md p-2 text-sm"
        placeholder="Compartilhe sua experiência..."
        value={content}
        onChange={e => setContent(e.target.value)}
        disabled={disabled}
      />

      <button
        onClick={handleSubmit}
        disabled={disabled}
        className={`mt-4 px-4 py-2 rounded-md bg-orange-400 w-1/6 text-white ${disabled ? 'hidden' : ''}`}
      >
        Enviar comentário
      </button>
    </div>
  );
}
