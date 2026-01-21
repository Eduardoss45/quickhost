import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAccommodation } from '@/hooks/useAccommodation';
import {
  accommodationFormSchema,
  AccommodationFormValues,
} from '@/schemas/accommodation-form.schema';
import { useMultiStepForm } from '@/hooks/useMultiStepForm';
import { accommodationToForm } from '@/mappers/accommodation.mapper';
import { toast } from 'sonner';

import AccommodationDetailsForm from '@/components/custom/edit-form/AccommodationDetailsForm';
import AccommodationAddressForm from '@/components/custom/edit-form/AccommodationAddressForm';
import AccommodationResourcesForm from '@/components/custom/edit-form/AccommodationResourcesForm';
import AccommodationPricingForm from '@/components/custom/edit-form/AccommodationPricingForm';
import { TfiClose } from 'react-icons/tfi';

export default function EditMultiStepForm() {
  const { id } = useParams<{ id: string }>();
  const { getById, update, loading } = useAccommodation();

  const methods = useForm<AccommodationFormValues>({
    resolver: zodResolver(accommodationFormSchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      description: '',

      internal_images: [],
      main_cover_index: undefined,
      images_replaced: false,

      category: null,
      space_type: null,

      price_per_night: 0,
      cleaning_fee: 0,
      discount: false,

      room_count: 1,
      bed_count: 1,
      bathroom_count: 1,
      guest_capacity: 1,

      address: '',
      city: '',
      neighborhood: '',
      postal_code: '',
      uf: '',

      wifi: false,
      tv: false,
      kitchen: false,
      washing_machine: false,
      parking_included: false,
      air_conditioning: false,
      pool: false,
      jacuzzi: false,
      grill: false,
      private_gym: false,
      beach_access: false,

      smoke_detector: false,
      fire_extinguisher: false,
      first_aid_kit: false,
      outdoor_camera: false,
    },
  });

  useEffect(() => {
    if (!id) return;

    async function loadAccommodation() {
      const data = await getById(id!);
      if (!data) return;

      methods.reset(accommodationToForm(data));
    }

    loadAccommodation();
  }, [id]);

  const formComponents = [
    <AccommodationDetailsForm key="details" />,
    <AccommodationAddressForm key="address" />,
    <AccommodationPricingForm key="pricing" />,
    <AccommodationResourcesForm key="resources" />,
  ];

  const stepFields: (keyof AccommodationFormValues)[][] = [
    ['title', 'price_per_night', 'cleaning_fee'],
    ['address', 'city', 'postal_code'],
    [],
    [],
  ];

  const { currentStep, currentComponent, changeStep, isLastStep, isFirstStep } =
    useMultiStepForm(formComponents);

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col min-h-screen"
        onSubmit={async e => {
          e.preventDefault();

          const fields = stepFields[currentStep];

          const isValid = await methods.trigger(fields);

          if (!isValid) return;

          if (!isLastStep) {
            changeStep(currentStep + 1);
            return;
          }

          if (!id) {
            toast.error('ID da acomodação inválido');
            return;
          }

          const data = methods.getValues();
          const formData = new FormData();

          const allowedKeys: (keyof AccommodationFormValues)[] = [
            'title',
            'description',
            'category',
            'space_type',
            'price_per_night',
            'cleaning_fee',
            'discount',
            'room_count',
            'bed_count',
            'bathroom_count',
            'guest_capacity',
            'address',
            'city',
            'neighborhood',
            'postal_code',
            'uf',
            'wifi',
            'tv',
            'kitchen',
            'washing_machine',
            'parking_included',
            'air_conditioning',
            'pool',
            'jacuzzi',
            'grill',
            'private_gym',
            'beach_access',
            'smoke_detector',
            'fire_extinguisher',
            'first_aid_kit',
            'outdoor_camera',
          ];

          allowedKeys.forEach(key => {
            const value = data[key];
            if (value !== null && value !== undefined) {
              formData.append(key, String(value));
            }
          });

          const newFiles = data.internal_images.filter(
            (file): file is File => file instanceof File
          );

          if (data.images_replaced) {
            if (newFiles.length === 0) {
              toast.error('Envie novas imagens antes de salvar');
              return;
            }

            if (data.main_cover_index === undefined) {
              toast.error('Selecione a imagem de capa');
              return;
            }

            const coverFile = newFiles[data.main_cover_index];
            if (!coverFile) {
              toast.error('Imagem de capa inválida');
              return;
            }

            formData.append('coverOriginalName', coverFile.name);
            newFiles.forEach(file => formData.append('images', file));
          } else {
            if (data.main_cover_index === undefined) {
              toast.error('Selecione a imagem de capa');
              return;
            }

            const selected = data.internal_images[data.main_cover_index];
            if (typeof selected !== 'string') {
              toast.error('Imagem de capa inválida');
              return;
            }

            formData.append('main_cover_image', selected);
          }

          await update(id, formData);
        }}
      >
        <Link to="/host" className="flex items-center gap-2 md:px-4 m-3 md:mx-10 mt-8">
          <TfiClose className="text-3xl" />
        </Link>

        <div className="flex-1 md:px-4 m-3">{currentComponent}</div>

        <div className="sticky bottom-0 bg-white md:p-4 flex justify-between">
          {!isFirstStep && (
            <button
              className="md:mx-10 mx-3 mb-5 px-6 py-2 bg-blue-500 text-white rounded-md"
              type="button"
              onClick={() => changeStep(currentStep - 1)}
            >
              Voltar
            </button>
          )}

          <button
            className="md:mx-10 mx-3 mb-5 px-6 py-2 bg-orange-400 text-white rounded-md"
            type="submit"
            disabled={loading}
          >
            {isLastStep ? 'Salvar' : 'Avançar'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
