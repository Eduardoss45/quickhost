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

import FormHeader from '../custom/creator-form/FormHeader';
import AccommodationInformationForm from '@/components/custom/creator-form/AccommodationInformationForm';
import AccommodationBasicsDetailsForm from '@/components/custom/creator-form/AccommodationBasicsDetailsForm';
import AccommodationSpaceTypeForm from '@/components/custom/creator-form/AccommodationSpaceTypeForm';
import AccommodationLocationForm from '@/components/custom/creator-form/AccommodationLocationForm';
import AccommodationAmenitiesForm from '@/components/custom/creator-form/AccommodationAmenitiesForm';
import AccommodationMediaForm from '@/components/custom/creator-form/AccommodationMediaForm';
import AccommodationDescriptionForm from '@/components/custom/creator-form/AccommodationDescriptionForm';
import AccommodationPricingForm from '@/components/custom/creator-form/AccommodationPricingForm';
import AccommodationBankForm from '@/components/custom/creator-form/AccommodationBankForm';
import AccommodationReviewStep from '@/components/custom/creator-form/AccommodationReviewStep';

export default function CreatorMultiStepForm() {
  const { id } = useParams<{ id: string }>();
  const { getById, createWithFiles, loading } = useAccommodation();

  const methods = useForm<AccommodationFormValues>({
    resolver: zodResolver(accommodationFormSchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      description: '',
      internal_images: [],
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
    <AccommodationInformationForm />,
    <AccommodationBasicsDetailsForm />,
    <AccommodationSpaceTypeForm />,
    <AccommodationLocationForm />,
    <AccommodationAmenitiesForm />,
    <AccommodationMediaForm />,
    <AccommodationDescriptionForm />,
    <AccommodationPricingForm />,
    <AccommodationBankForm />,
    <AccommodationReviewStep />,
  ];

  const stepFields: (keyof AccommodationFormValues)[][] = Array.from({ length: 10 }, () => []);

  const { currentStep, currentComponent, changeStep, isLastStep, isFirstStep } =
    useMultiStepForm(formComponents);

  const title = methods.watch('title');

  const watchedValues = methods.watch();
  useEffect(() => {}, [watchedValues]);

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

          data.internal_images.forEach((fileOrUrl, index) => {
            if (fileOrUrl instanceof File) {
              formData.append('images', fileOrUrl);
              if (index === 0) formData.append('coverOriginalName', fileOrUrl.name);
            } else if (typeof fileOrUrl === 'string') {
              formData.append('internal_images', fileOrUrl);
              if (index === 0) formData.append('main_cover_image', fileOrUrl);
            }
          });

          await createWithFiles(formData);
        }}
      >
        <FormHeader step={currentStep} name={title} />
        <div className="flex-1 md:px-4 m-3">{currentComponent}</div>
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
