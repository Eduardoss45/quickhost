import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { CiCamera } from 'react-icons/ci';
import { useFormContext } from 'react-hook-form';

import type { AccommodationFormValues } from '@/schemas/accommodation-form.schema';

type PreviewFile = File & { preview: string };

export default function AccommodationMediaForm() {
  const {
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<AccommodationFormValues>();

  const [photos, setPhotos] = useState<PreviewFile[]>([]);
  const [mainIndex, setMainIndex] = useState<number | undefined>(getValues('main_cover_index'));

  /**
   * Reidrata as imagens a partir do contexto do formulário
   * (quando o usuário volta para esta etapa)
   */
  useEffect(() => {
    const storedImages = getValues('internal_images');

    if (!storedImages || storedImages.length === 0) return;

    const withPreview: PreviewFile[] = storedImages.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setPhotos(withPreview);

    return () => {
      withPreview.forEach(p => URL.revokeObjectURL(p.preview));
    };
  }, [getValues]);

  const onDrop = (files: File[]) => {
    const currentImages = getValues('internal_images') ?? [];

    if (currentImages.length + files.length > 20) return;

    const withPreview: PreviewFile[] = files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setPhotos(prev => [...prev, ...withPreview]);

    setValue('internal_images', [...currentImages, ...files], {
      shouldValidate: true,
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  const handleCoverSelect = (index: number) => {
    setMainIndex(index);
    setValue('main_cover_index', index, {
      shouldValidate: true,
    });
  };

  return (
    <div>
      <h2 className="text-2xl">Imagens da acomodação</h2>

      {errors.main_cover_index && (
        <p className="text-sm text-red-500 mt-2">{errors.main_cover_index.message}</p>
      )}

      <div className="flex justify-center m-8">
        <div
          {...getRootProps()}
          className="flex flex-col items-center w-1/2 p-12 border border-dashed rounded-md cursor-pointer"
        >
          <input {...getInputProps()} />
          <CiCamera size={60} />
          <p>Arraste imagens aqui</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-4">
        {photos.map((photo, i) => (
          <div
            key={i}
            onClick={() => handleCoverSelect(i)}
            className={`cursor-pointer overflow-hidden rounded border h-32 ${
              mainIndex === i ? 'border-orange-500 border-4' : 'border-transparent'
            }`}
          >
            <img src={photo.preview} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
