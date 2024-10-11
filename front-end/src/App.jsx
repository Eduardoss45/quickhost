import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cadastro from "./pages/Cadastro";
import Favoritos from "./pages/Favoritos";
import Reservas from "./pages/Reservas";
import Acomodacao from "./pages/Acomodacao";
import Anuncio from "./components/Anuncio";
import EditorDePerfil from "./pages/EditorDePerfil";
import Hospedar from "./pages/Hospedar";
import CadastroAcomodacoes from "./pages/CadastroAcomodacoes";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import useData from "./hooks/useData"; // Correção aqui
import RegistroReservas from "./components/RegistroReservas";

function App() {
  const { data, loading, error } = useData(
    "http://localhost:8000/accommodation/"
  );
  const accommodations = data && Array.isArray(data) ? data : []; // Ajustado para ser um array
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
    <div className="App">
      <BrowserRouter>
        <Navbar onSearch={handleSearch} />
        {loading ? (
          <>Carregando...</>
        ) : error ? (
          <>Erro ao buscar dados: {error.message}</>
        ) : (
          <Routes>
            <Route
              path="/"
              element={<Home accommodations={filteredAccommodations} />}
            />
            <Route path="/perfil" element={<EditorDePerfil />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/acomodacao" element={<Acomodacao />} />
            <Route path="/hospedar" element={<Hospedar />}>
              <Route path="anuncio" element={<Anuncio />} />
              <Route path="registro" element={<RegistroReservas />} />
            </Route>
            <Route
              path="/cadastro/acomodacoes"
              element={<CadastroAcomodacoes />}
            />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
