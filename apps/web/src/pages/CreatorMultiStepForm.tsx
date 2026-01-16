import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

import FormHeader from './FormHeader';
import Step1 from '@/components/custom/creator-form/Step1';
import Step2 from '@/components/custom/creator-form/Step2';
import Step3 from '@/components/custom/creator-form/Step3';
import Step4 from '@/components/custom/creator-form/Step4';
import Step5 from '@/components/custom/creator-form/Step5';
import Step6 from '@/components/custom/creator-form/Step6';
import Step7 from '@/components/custom/creator-form/Step7';
import Step8 from '@/components/custom/creator-form/Step8';
import Step9 from '@/components/custom/creator-form/Step9';
import Step10 from '@/components/custom/creator-form/Step10';

export default function CreatorMultiStepForm() {
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
    <Step1 />,
    <Step2 />,
    <Step3 />,
    <Step4 />,
    <Step5 />,
    <Step6 />,
    <Step7 />,
    <Step8 />,
    <Step9 />,
    <Step10 />,
  ];

  const stepFields: (keyof AccommodationFormValues)[][] = Array.from({ length: 10 }, () => []);

  const { currentStep, currentComponent, changeStep, isLastStep, isFirstStep } =
    useMultiStepForm(formComponents);

  const title = methods.watch('title');

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

          if (data.images_replaced) {
            const newFiles = data.internal_images.filter(
              (file): file is File => file instanceof File
            );

            newFiles.forEach(file => formData.append('images', file));
          } else {
            if (data.main_cover_index !== undefined) {
              const selected = data.internal_images[data.main_cover_index];
              if (typeof selected === 'string') {
                formData.append('main_cover_image', selected);
              }
            }
          }

          await update(id, formData);
        }}
      >
        <FormHeader step={currentStep} name={title} />

        <div className="flex-1 px-4">{currentComponent}</div>

        <div className="sticky bottom-0 bg-white p-4 flex justify-between">
          {!isFirstStep && (
            <button
              className="mx-10 mb-5 px-6 py-2 bg-blue-500 text-white rounded-md"
              type="button"
              onClick={() => changeStep(currentStep - 1)}
            >
              Voltar
            </button>
          )}

          <button
            className="mx-10 mb-5 px-6 py-2 bg-orange-400 text-white rounded-md"
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
