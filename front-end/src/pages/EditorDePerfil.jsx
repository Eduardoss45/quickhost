import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import useEdit from "../hooks/useEdit";
import "./EditorDePerfil.css";

const EditorDePerfil = ({ handleReset }) => {
  const id_user = localStorage.getItem("id_user");
  const token = localStorage.getItem("token");

  const {
    formData,
    loading,
    error,
    success,
    fetchUserData,
    editUser,
    handleChange,
  } = useEdit(id_user, token);

  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    handleChange({
      target: {
        id: "profile_picture",
        value: file,
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, value);
      }
    });

    // Adiciona o profile_picture apenas se um arquivo for selecionado
    if (image) {
      form.append("profile_picture", image);
    }

    // Adicione um log para verificar o conteúdo do FormData antes do envio
    console.log("Dados enviados:", Array.from(form.entries()));

    try {
      await editUser(form);
      if (success) {
        alert("Dados atualizados com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  // const errorMessage = error?.response?.data || "Erro desconhecido";
  // if (errorMessage) return <p>Ocorreu um erro: {errorMessage}</p>;

  return (
    <div id="page-row-perfil">
      <div id="left-arrow">
        <Link to="/" onClick={handleReset}>
          <span>
            <FaArrowLeftLong />
          </span>
        </Link>
      </div>
      <div id="page-col-perfil">
        <form onSubmit={handleSubmit}>
          <h1>Informações pessoais</h1>
          {renderInput("username", "Nome Legal", formData.username)}
          {renderInput("social_name", "Nome Social", formData.social_name)}
          {renderInput("email", "Endereço de email", formData.email, true)}
          {renderInput("phone_number", "Telefone", formData.phone_number)}
          {renderInput(
            "birth_date",
            "Data de nascimento",
            formData.birth_date,
            true
          )}
          {renderInput(
            "emergency_contact",
            "Contato de emergência",
            formData.emergency_contact
          )}
          {renderFileInput("profile_picture", "Foto de perfil", image)}

          <div className="row-line-edit">
            <button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  function renderInput(id, label, value, disabled = false) {
    return (
      <div>
        <label htmlFor={id}>
          <div className="row-line-edit">{label}</div>
          <span className="perfil-data">{value}</span>
          <input id={id} onChange={handleChange} disabled={disabled} />
        </label>
      </div>
    );
  }

  function renderFileInput(id, label, file) {
    return (
      <div>
        <label htmlFor={id}>
          <div className="row-line-edit">{label}</div>
          <span className="perfil-data">
            {file ? file.name : "Nenhuma imagem selecionada"}
          </span>
          <div className="custom-file-upload">
            <span>Escolha um arquivo</span>
            <input id={id} type="file" onChange={handleFileChange} />
          </div>
        </label>
      </div>
    );
  }
};

export default EditorDePerfil;
