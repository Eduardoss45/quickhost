import useAccommodation from '../hooks/useAccommodation';
import useEditAcomodacao from '../hooks/useEditAcomodacao';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditStep } from '../hooks/useEditStep';
import { useState, useEffect, useRef } from 'react';
import { LiaPenSolid } from 'react-icons/lia';
import { PiTrashSimple } from 'react-icons/pi';

import EditorStep1 from '../components/custom/edit-form/AccommodationDetailsForm';
import EditorStep2 from '../components/custom/edit-form/AccommodationAddressForm';
import EditorStep3 from '../components/custom/edit-form/AccommodationResourcesForm';

import Cabecalho11 from './Cabecalho11';
import Cabecalho12 from './Cabecalho12';
import Cabecalho13 from './Cabecalho13';

const formTemplate = {};

export default function AccommodationsEditor() {
  const [formData, setFormData] = useState(formTemplate);
  const { handleSubmit, handleDelete } = useEditAcomodacao();
  const { id } = useParams();
  const { accommodationData } = useAccommodation(id);
  console.log(accommodationData);
  const [isWarned, setIsWarned] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    console.log('FormData atualizado:', formData);
  }, [formData]);

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const updateFieldHandler = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prevData => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const formCabecalhos = [
    <Cabecalho11 name={accommodationData?.title} />,
    <Cabecalho12 name={accommodationData?.title} />,
    <Cabecalho13 name={accommodationData?.title} />,
  ];

  const formComponents = [
    <EditorStep1
      data={formData}
      updateFieldHandler={updateFieldHandler}
      accommodationData={accommodationData}
    />,
    <EditorStep2
      data={formData}
      updateFieldHandler={updateFieldHandler}
      accommodationData={accommodationData}
    />,
    <EditorStep3
      data={formData}
      updateFieldHandler={updateFieldHandler}
      accommodationData={accommodationData}
    />,
  ];

  const { currentStep, currentCabecalho, currentComponent, changeStep } = useEditStep(
    formCabecalhos,
    formComponents
  );

  const validateForm = () => {
    const requiredFields = [];

    for (const field of requiredFields) {
      const value = formData[field];
      if (!value) {
        console.warn(`Campo obrigatório não preenchido: ${field}`);
        return false;
      }
    }
    return true;
  };

  const formRef = useRef();

  const handleExternalSubmit = () => {
    if (validateForm()) {
      formRef.current.requestSubmit();
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  const handleFormSubmit = e => {
    e.preventDefault();

    if (validateForm()) {
      handleSubmit(formData, accommodationData?.id_accommodation);
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  const handleDeleteAccommodation = e => {
    e.preventDefault();

    if (!isWarned) {
      alert(
        'Você está prestes a deletar essa acomodação, isso pode ser irreversível e caso haja reservas, elas serão imediatamente canceladas e um reembolso será feito para o cliente. Caso queira prosseguir, confirme e clique novamente.'
      );

      setIsWarned(true);
    } else {
      handleDelete(accommodationData?.id_accommodation);
      setIsWarned(false);
      handleRefresh();
    }
  };

  const handleRefresh = () => {
    navigate('/hospedar');
    window.location.reload();
  };

  const handleCancelar = () => {
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        encType="multipart/form-data"
        onKeyDown={handleKeyDown}
      >
        <div>
          <>{currentCabecalho}</>
          <>{currentComponent}</>
        </div>
      </form>
      <div>
        {currentStep === 1 ? (
          <>
            <div>
              <span>
                <LiaPenSolid />
              </span>
              <h3>Anúncio</h3>
            </div>
            <button
              onClick={() => {
                changeStep(currentStep - 1);
              }}
            >
              Editar Anúncio
            </button>
          </>
        ) : currentStep === 2 ? (
          <>
            <div>
              <span>
                <LiaPenSolid />
              </span>
              <h3>Localização</h3>
            </div>
            <button
              onClick={() => {
                changeStep(currentStep - 1);
              }}
            >
              Editar Localização
            </button>
          </>
        ) : (
          <>
            <div>
              <span>
                <LiaPenSolid />
              </span>
              <h3>Comodidades</h3>
            </div>
            <button
              onClick={() => {
                changeStep(currentStep + 2);
              }}
            >
              Editar Comodidades
            </button>
          </>
        )}
        {currentStep === 1 ? (
          <>
            <div>
              <span>
                <LiaPenSolid />
              </span>
              <h3>Comodidades</h3>
            </div>
            <button
              onClick={() => {
                changeStep(currentStep + 1);
              }}
            >
              Editar Comodidades
            </button>
          </>
        ) : currentStep === 2 ? (
          <>
            <div>
              <span>
                <LiaPenSolid />
              </span>
              <h3>Anúncio</h3>
            </div>
            <button
              onClick={() => {
                changeStep(currentStep - 2);
              }}
            >
              Editar Anúncio
            </button>
          </>
        ) : (
          <>
            <div>
              <span>
                <LiaPenSolid />
              </span>
              <h3>Localização</h3>
            </div>
            <button
              onClick={() => {
                changeStep(currentStep + 1);
              }}
            >
              Editar Localização
            </button>
          </>
        )}
      </div>
      <div>
        <div>
          <span>
            <PiTrashSimple />
          </span>
          <h3>Apagar Anúncio</h3>
        </div>
        <button onClick={handleDeleteAccommodation}>Apagar Anúncio</button>
      </div>
      <div>
        <button onClick={handleCancelar}>Sair</button>
        <button onClick={handleExternalSubmit}>Salvar Alterações</button>
      </div>
    </>
  );
}
