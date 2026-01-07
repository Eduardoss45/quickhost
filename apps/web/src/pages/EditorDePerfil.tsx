import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CiCamera } from "react-icons/ci";
import { PiArrowCircleLeftThin } from "react-icons/pi";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import useEdit from "../hooks/useEdit";
import './css/EditorDePerfil.css';

const EditorDePerfil = () => {
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

  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleFileDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      alert("Tipo de arquivo inválido. Somente imagens são permitidas.");
      return;
    }

    setImage(file);
    handleChange({
      target: {
        id: "profile_picture",
        value: file,
      },
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleReset = () => {
    setImage(null);
    fetchUserData();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    populateFormData(form, formData);

    if (image) {
      form.append("profile_picture", image);
    }

    console.log("Dados a serem enviados:", [...form.entries()]);

    try {
      await editUser(form);
    } catch (error) {
      console.log(error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
    accept: "image/*",
    multiple: false,
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div className="user-info-form">
      <div>
        <Link to="/">
          <span>
            <PiArrowCircleLeftThin />
          </span>
        </Link>
        <h2>Minhas informações</h2>
      </div>
      <form onSubmit={handleSubmit}>
        {renderInput("username", "Nome Completo", formData.username)}
        {renderInput("cpf", "CPF", formData.cpf, false, "14")}
        {renderInput(
          "birth_date",
          "Data de Nascimento",
          formData.birth_date,
          true
        )}
        {renderInput("social_name", "Nome Social", formData.social_name)}
        {renderInput("email", "Email", formData.email, true)}
        {renderInput(
          "phone_number",
          "Telefone",
          formData.phone_number,
          false,
          "15"
        )}
        {renderPasswordInput("password", "Senha")}
        {renderFileInput("profile_picture", "Foto de Perfil", image)}
        {error && <p className="error">Certifique de preencher os dados!</p>}
        {success && <p className="success">Dados salvos com sucesso!</p>}
        <div className="buttons">
          <button type="button" onClick={handleReset} className="reset-button">
            Redefinir
          </button>
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );

  function renderInput(id, label, value, readOnly = false, maxLength = null) {
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        {error?.[id] && <p className="error">{error?.[id]}</p>}
        <input
          type="text"
          id={id}
          name={id}
          placeholder={value || `Digite seu ${label.toLowerCase()}`}
          onChange={handleChange}
          readOnly={readOnly}
          maxLength={maxLength || undefined}
        />
      </div>
    );
  }

  function renderPasswordInput(id, label) {
    return (
      <div className="password-field">
        <label>{label}</label>
        {error?.[id] && <p className="error">{error?.[id]}</p>}
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={id}
          placeholder="Digite sua senha"
          onChange={handleChange}
        />
        <button type="button" onClick={togglePasswordVisibility}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    );
  }

  function renderFileInput(id, label, file) {
    return (
      <div className="file-upload">
        <label>{label}</label>
        {error?.[id] && <p className="error">{error?.[id]}</p>}
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Solte a imagem aqui...</p>
          ) : (
            <>
              <CiCamera size={50} />
              <p>{file ? file.name : "Nenhuma imagem selecionada"}</p>
              <button type="button">Selecionar do Computador</button>
            </>
          )}
        </div>
      </div>
    );
  }

  function populateFormData(form, data) {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, value);
      }
    });
  }
};

export default EditorDePerfil;
