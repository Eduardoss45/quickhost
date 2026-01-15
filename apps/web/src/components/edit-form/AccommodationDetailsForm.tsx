import { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { CiCamera } from 'react-icons/ci';
import { FiImage } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useFormContext, Controller } from 'react-hook-form';
import { AccommodationFormValues } from '@/schemas/accommodation-form.schema';

type PreviewFile = File & { preview: string };

export default function AccommodationDetailsForm() {
  const { control, setValue, watch } = useFormContext<AccommodationFormValues>();

  const photos = watch('internal_images') || [];
  const mainCoverIndex = watch('main_cover_index');

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles: PreviewFile[] = acceptedFiles.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setValue('internal_images', [...photos, ...newFiles], {
      shouldDirty: true,
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    multiple: true,
    disabled: photos.length >= 20,
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">
          Adicione fotos de sua acomodação (mínimo 5 imagens)
        </h2>
        <p className="text-sm text-muted-foreground">
          Você pode selecionar mais imagens posteriormente
        </p>
      </div>

      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-orange-400 transition"
      >
        <input {...getInputProps()} />
        <CiCamera size={50} className="text-orange-500 mb-2" />
        <p className="text-center text-sm">
          {isDragActive ? 'Solte as imagens aqui...' : 'Selecione do computador ou arraste para cá'}
        </p>
      </div>

      {photos.length < 5 && (
        <p className="text-sm text-red-500">Você precisa adicionar pelo menos 5 fotos.</p>
      )}

      {photos.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Imagens escolhidas</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {photos.map((photo, index) => (
              <div
                key={index}
                className={`relative border rounded overflow-hidden cursor-pointer ${mainCoverIndex === index ? 'border-2 border-orange-500' : 'border-gray-200'}`}
                onClick={() => setValue('main_cover_index', index)}
              >
                <img
                  src={photo.preview}
                  alt={`Preview ${index}`}
                  className="object-cover w-full h-24"
                />
                <FiImage className="absolute top-1 right-1 text-orange-500" />
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setValue('internal_images', []);
              setValue('main_cover_index', undefined);
            }}
          >
            Limpar imagens
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Nome da Acomodação</Label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => <Input {...field} id="title" maxLength={32} />}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição da Acomodação</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => <Textarea {...field} id="description" maxLength={400} rows={4} />}
        />
      </div>
    </div>
  );
}
