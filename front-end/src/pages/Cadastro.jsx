import React, { useEffect } from "react";
import useCadastro from "../hooks/useCadastro";
import { Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import "./Cadastro.css";

const Cadastro = ({ resetPage }) => {
  const { formData, loading, error, success, handleChange, handleSubmit } =
    useCadastro();

  const resetForm = () => {
    handleChange({ target: { name: "username", value: "" } });
    handleChange({ target: { name: "birth_date", value: "" } });
    handleChange({ target: { name: "phone_number", value: "" } });
    handleChange({ target: { name: "email", value: "" } });
    handleChange({ target: { name: "password", value: "" } });
  };

  useEffect(() => {
    if (success) {
      resetForm();
    }
  }, [success]);

  return (
    <div id="page-row">
      <div id="left-arrow">
        <Link to="/" onClick={resetPage}>
          <span>
            <FaArrowLeftLong />
          </span>
        </Link>
      </div>
      <div id="page-col">
        <form onSubmit={handleSubmit}>
          <h1>Criar Conta</h1>
          <div>
            <label>
              Username
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Data de Nascimento
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Numero de Contato
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Endereço de email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <input
              type="submit"
              value={loading ? "Aguarde..." : "Criar conta"}
              disabled={loading}
            />
          </div>
          <p
            className={
              error ? "error message" : success ? "success message" : ""
            }
          >
            {error
              ? `Erro ao cadastrar o usuário: ${error}`
              : success
              ? "Usuário cadastrado com sucesso!"
              : ""}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
