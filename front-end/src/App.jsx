import Footer from "./components/Footer";
import Anuncio from "./components/Anuncio";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Cadastro from "./components/Cadastro";
import Home from "./pages/Home";
import Favoritos from "./pages/Favoritos";
import Reservas from "./pages/Reservas";
import EditorDePerfil from "./pages/EditorDePerfil";
import Hospedar from "./pages/Hospedar";
import CadastroAcomodacoes from "./pages/CadastroAcomodacoes";
import Configuracoes from "./pages/Configuracoes";
import useData from "./hooks/useData";
import useUserData from "./hooks/useUserData";
import Step1 from "./template/components/Step1";
import CardCancelarReservas from "./components/CardCancelarReservas";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import InformacoesAcomodacao from "./pages/InformacoesAcomodacao";
import useDetalhes from "./hooks/useDetalhes";
import EditorAcomodacoes from "./pages/EditorAcomodacoes";

function App() {
  const { data, loading, error } = useData();
  const accommodations = data && Array.isArray(data) ? data : [];
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredAccommodations = searchTerm
    ? accommodations.filter((acc) =>
        acc.localization.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : accommodations;

  return (
    <div
      className={`App ${
        location.pathname === "/cadastro" || location.pathname === "/entrar"
          ? "no-overflow"
          : "App-flex"
      }`}
    >
      <BrowserRouter>
        <InnerApp
          accommodations={filteredAccommodations}
          loading={loading}
          error={error}
          onSearch={handleSearch}
        />
      </BrowserRouter>
    </div>
  );
}

function InnerApp({ accommodations, loading, error, onSearch }) {
  const { userData } = useUserData();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/entrar" && location.pathname !== "/cadastro" && (
        <Navbar onSearch={onSearch} />
      )}

      {loading ? (
        <>Carregando...</>
      ) : error ? (
        <>Erro ao buscar dados: {error.response.data}</>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isAuthenticated={isAuthenticated}
                accommodations={accommodations}
              />
            }
          />
          {/* <Route path="/acomodacao" element={<Anuncio />} /> */}
          <Route path="/acomodacao/:data" element={<Anuncio />} />
          <Route path="/perfil" element={<EditorDePerfil />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/reservas" element={<Reservas userData={userData} />} />
          <Route path="/reservas/:id" element={<CardCancelarReservas />} />
          <Route
            path="/hospedar"
            element={
              <Hospedar
                accommodationData={userData?.registered_accommodations || null}
              />
            }
          />
          <Route path="/hospedar/:id" element={<InformacoesAcomodacao />} />
          <Route path="/editor/:id" element={<EditorAcomodacoes />} />
          <Route path="/acomodacoes" element={<CadastroAcomodacoes />}>
            <Route path="nova" element={<Step1 />} />
          </Route>
          <Route
            path="/entrar"
            element={
              <Login
                style={loading || error ? { display: "none" } : {}}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
        </Routes>
      )}

      {location.pathname !== "/entrar" &&
        location.pathname !== "/cadastro" &&
        location.pathname !== "/acomodacoes/nova" && (
          <Footer
            className={`App ${
              location.pathname !== "/entrar" &&
              location.pathname !== "/cadastro"
                ? "no-fixed"
                : ""
            }`}
          />
        )}
    </>
  );
}

export default App;
