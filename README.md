# Quickhost

**Quickhost** é uma aplicação web desenvolvida com `Django` no back-end e `React` com `Vite` no front-end. A estrutura do projeto está organizada em duas pastas principais: `back-end` para o Django e `front-end` para o React.

## Estrutura do Projeto

## Pré-requisitos

Antes de iniciar, instale as seguintes dependências:

- **Python 3.8+** (com `pip`)
- **Node.js** (versão 14 ou superior) e **npm** ou **yarn**
- **Virtualenv** (opcional, mas recomendado para gerenciar dependências do Python)

---

## Configuração e Execução do Projeto

### Passo 1: Configuração do Back-end (Django)

1. **Acesse a pasta do back-end**:

   ```bash
   cd back-end
   ```

2. Crie um ambiente virtual para o Django:

   ```bash
   python3 -m venv venv
   ```

3. Ative o ambiente virtual:

   - Linux/macOS:

   ```bash
   source venv/bin/activate
   ```

   - Windows:

   ```bash
   venv\Scripts\activate
   ```

4. Instale as dependências listadas no arquivo `requirements.txt`:

   ```bash
   pip install -r requirements.txt
   ```

5. Configure o banco de dados executando as migrações iniciais:

   ```bash
   python manage.py migrate
   ```

6. (Opcional) Crie um superusuário para acessar o painel administrativo do Django:

   ```bash
   python manage.py createsuperuser
   ```

7. Inicie o servidor de desenvolvimento do Django:

   ```bash
   python manage.py runserver
   ```

   O servidor estará disponível em `http://127.0.0.1:8000`.

---

### Passo 2: Configuração do Front-end (React + Vite)

1. Acesse a pasta do front-end:

   ```bash
   cd ../front-end
   ```

2. Instale as dependências do projeto usando npm ou yarn:

   - Usando npm:

   ```bash
   npm install
   ```

   - Usando yarn:

   ```bash
   yarn
   ```

3. Inicie o servidor de desenvolvimento do Vite:

   - Usando npm:

   ```bash
   npm run dev
   ```

   - Usando yarn:

   ```bash
   yarn dev
   ```

   O servidor estará disponível em `http://127.0.0.1:5173`.

---

## Configuração de Variáveis de Ambiente

### Front-end

Na pasta `front-end`, acesse um arquivo `.env` adicione as variáveis de ambiente se necessárias para o as rotas do servidor. Exemplo:

- VITE_BASE_URL=http://127.0.0.1:8000/

---

## Executando o Projeto Completo

Para rodar a aplicação completa em um ambiente de desenvolvimento, siga os passos abaixo:

1. Inicie o back-end com Django:

   ```bash
   cd back-end
   python manage.py runserver
   ```

2. Inicie o front-end com React + Vite em outra janela de terminal:

   ```bash
   cd front-end
   npm run dev
   ```

Agora, o back-end estará rodando em `http://127.0.0.1:8000` e o front-end em `http://127.0.0.1:5173`.

---

## Recursos Adicionais

- [Documentação Django](https://www.djangoproject.com/)
- [Documentação Vite](https://vitejs.dev/)
- [Documentação React](https://reactjs.org/)

Feito pela equipe Quickhost.
