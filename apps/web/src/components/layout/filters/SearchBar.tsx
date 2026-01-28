import { useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import { IoSearchOutline } from 'react-icons/io5';
import { HiChevronDown } from 'react-icons/hi2';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (term: string) => void;
  onFilterClick: (filter: string) => void;
  onSort: (sort: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterClick, onSort }) => {
  const [tipoHospedagem, setTipoHospedagem] = useState('Tipo de Hospedagem');
  const [ordenarPor, setOrdenarPor] = useState('Ordenar por');

  const categoryMapping: Record<string, string> = {
    Pousada: 'inn',
    Chalé: 'chalet',
    Apartamento: 'apartment',
    Casa: 'home',
    Quarto: 'room',
    Todos: '',
  };

  const orderMapping: Record<string, string> = {
    Avaliação: 'rating',
    'Mais recentes': 'newest',
    'Mais antigos': 'oldest',
    Todos: '',
  };

  const handleTipoHospedagemClick = (tipo: string) => {
    setTipoHospedagem(tipo);
    onFilterClick(categoryMapping[tipo] || '');
  };

  const handleOrdenarPorClick = (ordenacao: string) => {
    setOrdenarPor(ordenacao);
    onSort(orderMapping[ordenacao] || '');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row items-center my-5 m-3 md:m-0 md:w-full gap-2 justify-center ">
      <div className="flex items-center gap-2 w-full md:w-1/2 border-b border-0 px-2 py-2">
        <IoSearchOutline className="text-3xl" />
        <input
          placeholder="Digite o nome da localidade..."
          className="border-none w-full focus:outline-none focus:ring-0"
          onChange={handleSearchChange}
        />
      </div>

      <div className="flex items-center gap-2">
        <CiFilter className="text-3xl" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex flex-row items-center gap-2 border px-3 py-2">
              {tipoHospedagem} <HiChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="max-h-60 overflow-y-auto shadow-sm rounded-md p-3 mt-2 bg-white z-50"
            align="start"
          >
            {Object.keys(categoryMapping).map(tipo => (
              <DropdownMenuItem
                key={tipo}
                onClick={() => handleTipoHospedagemClick(tipo)}
                className="
    cursor-pointer
    px-2 py-2
    outline-none
    focus:outline-none
    focus:bg-gray-100
    hover:bg-gray-200
    transition-colors
  "
              >
                {tipo}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex flex-row items-center gap-2 border px-3 py-2">
              {ordenarPor} <HiChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="max-h-60 overflow-y-auto shadow-sm rounded-md p-3 mt-2 bg-white z-50"
            align="start"
          >
            {['Avaliação', 'Mais recentes', 'Mais antigos', 'Todos'].map(opcao => (
              <DropdownMenuItem
                key={opcao}
                onClick={() => handleOrdenarPorClick(opcao)}
                className="
    cursor-pointer
    px-2 py-2
    outline-none
    focus:outline-none
    focus:bg-gray-100
    hover:bg-gray-200
    transition-colors
  "
              >
                {opcao}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SearchBar;
