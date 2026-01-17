import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { CiCamera } from 'react-icons/ci';
import { AccommodationFormValues } from '@/schemas/accommodation-form.schema';
import { UpdateFieldHandler } from '@/types';
import { useFormContext } from 'react-hook-form';

type PreviewFile = File & { preview: string };

export default function AccommodationMediaForm() {
  const { getValues, setValue } = useFormContext<AccommodationFormValues>();
  const [photos, setPhotos] = useState<PreviewFile[]>([]);
  const [mainIndex, setMainIndex] = useState<number | undefined>();

  const onDrop = (files: File[]) => {
    if (photos.length + files.length > 20) return;

    const withPreview = files.map(file =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );

    setPhotos(prev => [...prev, ...withPreview]);

    setValue('internal_images', [...photos, ...files]);
  };

  useEffect(() => {
    return () => {
      photos.forEach(p => URL.revokeObjectURL(p.preview));
    };
  }, [photos]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  const handleCoverSelect = (index: number) => {
    setMainIndex(index);
    setValue('main_cover_index', index);
  };

  return (
    <div>
      <h2>Imagens da acomodação</h2>

      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <CiCamera size={60} />
        <p>Arraste imagens aqui</p>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-4">
        {photos.map((photo, i) => (
          <img
            key={i}
            src={photo.preview}
            onClick={() => handleCoverSelect(i)}
            className={`cursor-pointer border ${
              mainIndex === i ? 'border-orange-500 border-4' : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
}
