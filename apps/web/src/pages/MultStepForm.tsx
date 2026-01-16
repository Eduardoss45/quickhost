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
import AccommodationDetailsForm from '@/components/edit-form/AccommodationDetailsForm';
import AccommodationAddressForm from '@/components/edit-form/AccommodationAddressForm';
import Steps from '@/components/custom/Steps';
import AccommodationResourcesForm from '@/components/edit-form/AccommodationResourcesForm';
import AccommodationPricingForm from '@/components/edit-form/AccommodationPricingForm';
import { toast } from 'sonner';

export default function MultStepForm() {
  const { id } = useParams<{ id: string }>();
  const { getById, update, loading } = useAccommodation();

  const methods = useForm<AccommodationFormValues>({
    resolver: zodResolver(accommodationFormSchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      description: '',
      price_per_night: 0,
      cleaning_fee: 0,

      category: null,
      space_type: null,

      internal_images: [],
      main_cover_index: undefined,

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
    <AccommodationPricingForm />,
    <AccommodationResourcesForm />,
  ];

  const stepFields: (keyof AccommodationFormValues)[][] = [
    ['title', 'price_per_night', 'cleaning_fee'],
    ['address', 'city', 'postal_code'],
    [],
  ];

  const { currentStep, currentComponent, changeStep, isLastStep, isFirstStep } =
    useMultiStepForm(formComponents);

  return (
    <FormProvider {...methods}>
      <Steps currentStep={currentStep} />

      <form
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

          Object.entries(data).forEach(([key, value]) => {
            if (key !== 'internal_images' && key !== 'main_cover_index') {
              if (value !== null && value !== undefined) {
                formData.append(key, String(value));
              }
            }
          });

          const newFiles: File[] = data.internal_images.filter(
            (file: File | string): file is File => file instanceof File
          );

          if (newFiles.length > 0) {
            const coverFile = newFiles[data.main_cover_index ?? -1];
            if (!coverFile) {
              toast.error('Selecione uma imagem de capa válida');
              return;
            }

            formData.append('coverOriginalName', coverFile.name);

            newFiles.forEach(file => formData.append('images', file));
          } else {
            if (data.main_cover_index === undefined) {
              toast.error('Selecione uma imagem de capa antes de continuar');
              return;
            }

            const selected = data.internal_images[data.main_cover_index];
            if (typeof selected !== 'string') {
              toast.error('Selecione uma imagem de capa válida');
              return;
            }

            formData.append('main_cover_image', selected);
          }

          await update(id, formData);
        }}
      >
        {currentComponent}

        <div>
          {!isFirstStep && (
            <button type="button" onClick={() => changeStep(currentStep - 1)}>
              Voltar
            </button>
          )}

          <button type="submit">{isLastStep ? 'Salvar' : 'Avançar'}</button>
        </div>
      </form>
    </FormProvider>
  );
}
