# 📌 Quickhost - Sistema de Hospedagem

Este projeto implementa um **sistema de hospedagem estilo Airbnb**, baseado em **arquitetura de microserviços**, com comunicação assíncrona via **RabbitMQ** e **chat e notificações em tempo real** utilizando **WebSocket**.

O foco principal foi entregar uma solução **end-to-end funcional**, com **separação clara de responsabilidades**, segurança básica aplicada e infraestrutura totalmente containerizada.

---

## ⚠️ Disclaimer Importante – Variáveis de Ambiente (`.env`)

> **⚠️ Atenção:**
> O correto funcionamento do sistema **depende obrigatoriamente** da configuração adequada dos arquivos `.env` em **todos os serviços** do projeto.

> Antes de executar o sistema localmente, é obrigatório:
> 1. Criar os arquivos `.env` a partir dos modelos fornecidos (`.env.example`).
> 2. Garantir que todas as variáveis obrigatórias estejam preenchidas.
> 3. Configurar corretamente os seguintes itens:

- **Credenciais de banco de dados** (host, porta, usuário, senha e nome do banco).
- **URLs internas de comunicação entre os serviços**.
- **Chaves JWT** utilizadas pelo `api-gateway` e pelo `auth-service`

  > As chaves **DEVEM SER IDÊNTICAS** para garantir a validação correta dos tokens.

- **Configuração do RabbitMQ** (host, porta, usuário, senha e vhost, se aplicável).
- **Configuração do WebSocket** (URL, porta e demais parâmetros necessários).

> A ausência ou configuração incorreta de variáveis de ambiente pode causar **falhas silenciosas**, erros de autenticação, falha na comunicação entre serviços ou falha total da aplicação.

---

## 🧱 Visão Geral da Arquitetura

```bash
Frontend (React + React Router)
        │
        ▼
API Gateway (NestJS)
        │
        ├── Auth Service
        │     └── Autenticação, JWT, Refresh Token
        │
        ├── Accommodation Service
        │     └── Acomodações, Comentários
        │
        ├── Booking Service
        │     └── Reservas
        │
        ├── Media Service
        │     └── Gerenciamento de rotas para imagens
        │
        ├── Notifications Service
        │     └── Notificações
        │
        └── Chat Service
              └── Mensagens em tempo real com persistência
```

### Tecnologias Principais

- **Monorepo** gerenciado com **Turborepo**
- **PostgreSQL** como banco de dados
- **RabbitMQ** para comunicação entre serviços
- **Docker + Docker Compose** para orquestração
- **TypeORM + Migrations** para controle de schema

---

## 🔐 Segurança & Autenticação

- Hash de senha com **bcrypt**
- Autenticação via **JWT**
- `accessToken` e `refreshToken`
- Tokens armazenados em **cookies HTTP-only**
- Proteção de rotas com **Guards + Passport**
- **Rate limit** aplicado no API Gateway (`10 req/s`)
- Payload do JWT minimizado (sem dados sensíveis)

> O **auth-service** é responsável exclusivamente por autenticação e emissão de tokens.
> O **API Gateway** apenas valida tokens já emitidos, mantendo separação clara de responsabilidades.

---

## 📋 Domínio de Tasks

### Funcionalidades

- Criar acomodações
- Editar acomodações
- Comentários por acomodação
- Criar reservas em acomodações
- Avaliação de acomodação
- Favoritar acomodações

### Status de reservas disponíveis

- `CAMCELED`
- `PENDING`
- `CONFIRMED`

### Tipos de acomodações disponíveis

- `INN`
- `CHALET`
- `APARTMENT`
- `HOME`
- `ROOM`

### Categorias de espaço

- `FULL_SPACE`
- `LIMITED_SPACE`

---

## 🔔 Notificações em Tempo Real

- Eventos consumidos via **RabbitMQ**
- Persistência em banco próprio
- Envio via **WebSocket**
- Frontend recebe notificações em tempo real

> O **notifications-service** não resolve identidade de usuários.
> Ele utiliza exclusivamente os UUIDs presentes nos payloads dos eventos publicados pelos serviços produtores.
> O serviço mantém sua **própria base de dados**, sem acoplamento com o domínio de accommodations.

---

## 🗨️ Chat

- Eventos consumidos via **RabbitMQ**
- Persistência em banco próprio
- Envio via **WebSocket**
- Frontend recebe mensagens e notificações em tempo real

> O **chat-service** não resolve identidade de usuários.
> Ele utiliza exclusivamente os UUIDs presentes nos payloads dos eventos publicados pelos serviços produtores.
> O serviço mantém sua **própria base de dados**, sem acoplamento com o domínio de accommodations.

---

## 🎨 Frontend

### Stack

- **React (Vite)**
- **React Router**
- **Tailwind CSS**
- **shadcn/ui**
- **react-hook-form + zod**

---

### Características do Frontend

- Skeleton loaders
- WebSocket conectado após login
- Feedback visual via toast
- Atualização otimista e invalidação de cache controlada

### Páginas Implementadas

- Login
- Registro
- Configurações (informações da conta e ajustes de dados)
- Troca de senha
- Lista de acomodações (filtro + busca)
- Lista de reservas (hospede ou anfitrião)
- Minhas acomodações (edito e criador)
- Chat (salas e clientes)
- Anuncio (comentários + status + imagens + reservas)

---

## 🐳 Infraestrutura & Docker

- Dockerfile individual por serviço
- docker-compose orquestrando:
  - API Gateway
  - Auth Service
  - Accommodation Service
  - Notifications Service
  - Chat Service
  - Media Service
  - Booking Service
  - PostgreSQL
  - RabbitMQ

### Execução com Docker

```bash
docker compose up --build
```

### Observação sobre Health Checks

- O frontend **não depende** de health checks para iniciar
- Utilizado `condition: service_started`
- Health checks usados apenas para **observabilidade e diagnóstico**

---

## 🗄️ Banco de Dados & Migrations

- TypeORM com **migrations explícitas**
- `synchronize: false` em todos os serviços
- Bancos separados por domínio

```sql
CREATE DATABASE qk_auth_db;
CREATE DATABASE qk_chat_db;
CREATE DATABASE qk_booking_db;
CREATE DATABASE qk_notifications_db;
CREATE DATABASE qk_accommodation_db;
```

### Execução de Migrations

- Executadas automaticamente no Docker
- Uso exclusivo de `migration:run`
- `migration:generate` nunca é usado em ambiente Docker

---

## ▶️ Execução Local (sem Docker)

```bash
npm install
npm run migrate:init
npm run test
npm run build
npm run dev
```

### Pré-requisitos

- Node.js **>= 18**
- PostgreSQL em execução
- RabbitMQ em execução
- Variáveis de ambiente configuradas (`.env`)

---

## 🧠 Decisões Técnicas Importantes

- Monorepo para padronização
- API Gateway como ponto único de entrada
- RabbitMQ para desacoplamento
- WebSocket fora do fluxo HTTP
- Relacionamentos entre serviços via **UUID**
- Eventos emitidos de forma ampla e filtrados no consumer

---

## ⚠️ Trade-offs & Observações

- Rate limit difícil de testar manualmente
- UI focada em funcionalidade
- Observabilidade avançada deixada como evolução natural

> A arquitetura está preparada para escalar e evoluir sem refatorações estruturais.

---

## 🚀 Melhorias Futuras

- Redis para cache
- Retry + DLQ no RabbitMQ
- Notificações de reservas vencidas
- Testes E2E
