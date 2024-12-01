import React, { Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import useData from "./hooks/useData";
import useUserData from "./hooks/useUserData";
const Home = React.lazy(() => import("./pages/Home"));
const Anuncio = React.lazy(() => import("./components/Anuncio"));
const Login = React.lazy(() => import("./components/Login"));
const Cadastro = React.lazy(() => import("./components/Cadastro"));
const Favoritos = React.lazy(() => import("./pages/Favoritos"));
const Reservas = React.lazy(() => import("./pages/Reservas"));
const EditorDePerfil = React.lazy(() => import("./pages/EditorDePerfil"));
const Hospedar = React.lazy(() => import("./pages/Hospedar"));
const CadastroAcomodacoes = React.lazy(() =>
  import("./pages/CadastroAcomodacoes")
);
const Configuracoes = React.lazy(() => import("./pages/Configuracoes"));
const CardCancelarReservas = React.lazy(() =>
  import("./components/CardCancelarReservas")
);
const Pagamento = React.lazy(() => import("./pages/Pagamento"));
const FormPagamento = React.lazy(() => import("./components/FormPagamento"));
const FinalizacaoReservas = React.lazy(() =>
  import("./pages/FinalizacaoReservas")
);
const InformacoesAcomodacao = React.lazy(() =>
  import("./pages/InformacoesAcomodacao")
);
const EditorAcomodacoes = React.lazy(() => import("./pages/EditorAcomodacoes"));
const Step1 = React.lazy(() => import("./template/components/Step1"));

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
        <Suspense fallback={<div>Carregando...</div>}>
          <InnerApp
            accommodations={filteredAccommodations}
            loading={loading}
            error={error}
            onSearch={handleSearch}
          />
        </Suspense>
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
          <Route path="/acomodacao/:data" element={<Anuncio />} />
          <Route path="/perfil" element={<EditorDePerfil />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/reservas" element={<Reservas userData={userData} />} />
          <Route path="/reservas/:id" element={<CardCancelarReservas />} />
          <Route path="/pagamento/:id" element={<Pagamento />} />
          <Route path="/form/:id" element={<FormPagamento />} />
          <Route path="/finalizacao/:id" element={<FinalizacaoReservas />} />
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
