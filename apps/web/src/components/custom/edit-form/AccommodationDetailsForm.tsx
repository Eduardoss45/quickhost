import { useDropzone } from 'react-dropzone';
import { CiCamera } from 'react-icons/ci';
import { FiImage } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useFormContext, Controller } from 'react-hook-form';
import { AccommodationFormValues } from '@/schemas/accommodation-form.schema';

type PreviewFile = File & { preview: string };

export default function AccommodationDetailsForm() {
  const { control, setValue, watch } = useFormContext<AccommodationFormValues>();
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const photos = watch('internal_images') || [];
  const mainCoverIndex = watch('main_cover_index');
  const imagesReplaced = watch('images_replaced');
  const hasOnlyStrings = photos.some(p => typeof p === 'string');
  const formLocked = hasOnlyStrings && !imagesReplaced;
  const onDrop = (acceptedFiles: File[]) => {
    const newFiles: PreviewFile[] = acceptedFiles.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setValue('internal_images', newFiles, { shouldDirty: true });
    setValue('images_replaced', true, { shouldDirty: true });
    setValue('main_cover_index', undefined, { shouldDirty: true });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
    disabled: false,
  });

  return (
    <div className="space-y-6 md:m-10 m-3">
      {formLocked && (
        <div className="bg-yellow-100 border border-yellow-300 p-3 rounded text-sm">
          ⚠️ Para editar os dados, você precisa substituir as imagens primeiro.
        </div>
      )}

      {photos.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-2xl mb-3">Escolha a imagem de capa</h2>

          <div className="grid grid-cols-4 grid-rows-2 gap-2 max-h-64">
            {photos.slice(0, 4).map((photo, index) => {
              const gridClass =
                index === 0
                  ? 'col-span-2 row-span-2'
                  : index === 1
                    ? 'col-span-2 row-span-1'
                    : 'col-span-1 row-span-1';

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (formLocked) return;
                    setValue('main_cover_index', index, { shouldDirty: true });
                  }}
                  className={`relative border rounded overflow-hidden cursor-pointer
          ${gridClass}
          ${mainCoverIndex === index ? 'border-2 border-orange-500' : 'border-gray-200'}
          ${formLocked ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <img
                    src={typeof photo === 'string' ? `${API_BASE_URL}${photo}` : photo.preview}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <FiImage className="absolute top-1 right-1 text-orange-500" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition cursor-pointer hover:border-orange-400"
      >
        <input {...getInputProps()} />
        <CiCamera size={50} className="text-orange-500 mb-2" />
        <p className="text-center text-sm">
          {isDragActive
            ? 'Solte as imagens aqui...'
            : 'Selecione ou arraste novas imagens para substituir'}
        </p>
      </div>

      <fieldset disabled={formLocked} className="space-y-4 md:w-1/2 w-full">
        <div>
          <Label htmlFor="title">Nome</Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input className="my-3 py-5" {...field} />}
          />
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Textarea className="my-3" {...field} rows={4} />}
          />
        </div>
      </fieldset>
    </div>
  );
}
