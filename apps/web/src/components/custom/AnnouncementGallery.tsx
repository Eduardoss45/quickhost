import { FiImage } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Props {
  images: string[];
}

export default function AnnouncementGallery({ images }: Props) {
  if (!images?.length) {
    return <p>Imagens indisponíveis</p>;
  }

  return (
    <section className="space-y-2">
      <div className="grid grid-cols-4 grid-rows-2 gap-2 max-h-[420px]">
        {images.slice(0, 4).map((image, index) => {
          const gridClass =
            index === 0
              ? 'col-span-2 row-span-2'
              : index === 1
                ? 'col-span-2 row-span-1'
                : 'col-span-1 row-span-1';

          return (
            <div key={image} className={`relative border rounded overflow-hidden ${gridClass}`}>
              <img
                src={`${API_BASE_URL}${image}`}
                alt={`Imagem ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <FiImage className="absolute top-1 right-1 text-orange-500" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
