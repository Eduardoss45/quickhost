import { IoStarSharp } from 'react-icons/io5';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema, CommentFormData } from '@/schemas/comment.schema';

interface Props {
  onSubmit: (data: CommentFormData) => void;
  disabled?: boolean;
}

export default function CommentsForm({ onSubmit, disabled }: Props) {
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
      rating: 0,
    },
  });

  const submit = (data: CommentFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="border rounded-lg p-4 my-4 mb-6 flex flex-col">
      <div className="flex justify-between">
        <h3 className="font-semibold mb-2">Deixe seu comentário</h3>

        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.onChange(value)}
                  className="text-xl"
                  disabled={disabled}
                >
                  <IoStarSharp
                    className={value <= field.value ? 'text-yellow-500' : 'text-muted-foreground'}
                  />
                </button>
              ))}
            </div>
          )}
        />
      </div>

      {errors.rating && <span className="text-xs text-red-500 mt-1">{errors.rating.message}</span>}

      <textarea
        {...register('content')}
        className="w-full border rounded-md p-2 text-sm mt-2"
        placeholder="Compartilhe sua experiência..."
        disabled={disabled}
      />

      {errors.content && (
        <span className="text-xs text-red-500 mt-1">{errors.content.message}</span>
      )}

      <button
        type="submit"
        disabled={disabled}
        className={`mt-4 px-4 py-2 rounded-md bg-orange-400 md:w-1/6 text-white ${
          disabled ? 'hidden' : ''
        }`}
      >
        Enviar comentário
      </button>
    </form>
  );
}
