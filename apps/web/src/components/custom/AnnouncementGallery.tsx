import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Props {
  images: string[];
}

export default function AnnouncementGallery({ images }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % Math.min(images.length, 5));
    }, 3500);

    return () => clearInterval(interval);
  }, [images]);

  if (!images?.length) {
    return <p>Imagens indisponíveis</p>;
  }

  return (
    <section className="space-y-2">
      <div className="md:hidden relative w-full aspect-[4/3] overflow-hidden rounded">
        {images.slice(0, 5).map((image, index) => (
          <img
            key={image}
            src={`${API_BASE_URL}${image}`}
            alt={`Imagem ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 max-h-105">
        {images.slice(0, 4).map((image, index) => {
          const gridClass =
            index === 0
              ? 'col-span-2 row-span-2'
              : index === 1
                ? 'col-span-2 row-span-1'
                : 'col-span-1 row-span-1';

          return (
            <div key={image} className={`rounded overflow-hidden ${gridClass}`}>
              <img
                src={`${API_BASE_URL}${image}`}
                alt={`Imagem ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
