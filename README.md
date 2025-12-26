# 📐 Regra Universal de Stack — Full-stack Moderno

## 🎯 Princípios Obrigatórios (independentes de tecnologia)

Todo projeto **deve** atender a estes princípios:

1. **Separação clara de responsabilidades**

   * UI ≠ Estado ≠ Domínio ≠ Infra
2. **Tipagem forte ponta a ponta**
3. **Validação em borda** (input nunca é confiável)
4. **Observabilidade mínima**

   * logs estruturados
   * health checks
5. **Ambiente reproduzível**

   * Docker obrigatório
6. **Documentação mínima executável**

   * README + Swagger

Esses princípios **não mudam**, mesmo que frameworks mudem.

---

## 🧩 Camada 1 — Front-end (Regra Universal)

### Stack Base (imutável)

```txt
React
TypeScript
Tailwind CSS
```

### Regras obrigatórias

* Roteamento explícito (SPA)
* Componentização previsível
* Zero lógica de domínio em componentes de UI

### Ferramentas padronizadas

| Responsabilidade | Tecnologia      |
| ---------------- | --------------- |
| Roteamento       | TanStack Router |
| Estado global    | Zustand         |
| Data fetching    | TanStack Query  |
| Formulários      | react-hook-form |
| Validação        | Zod             |
| UI base          | shadcn/ui       |

### Regras arquiteturais

* **Server State ≠ Client State**

  * Server → TanStack Query
  * Client → Zustand
* **Zod é a fonte da verdade** para validação
* **Nenhum fetch direto em componente**

📌 *Qualquer projeto antigo deve ser migrado para este modelo, mesmo que continue simples.*

---

## 🛠️ Camada 2 — Back-end (Regra Universal)

### Stack Base (imutável)

```txt
Node.js
TypeScript
NestJS
```

### Organização obrigatória

```txt
Controller
DTO
Service
Domain (opcional, mas recomendado)
Repository
```

### Tecnologias padrão

| Responsabilidade | Tecnologia       |
| ---------------- | ---------------- |
| ORM              | TypeORM          |
| Banco relacional | PostgreSQL       |
| Validação        | class-validator  |
| Auth             | JWT + Passport   |
| Hash             | bcrypt ou argon2 |

### Regras arquiteturais

* **Controller nunca contém regra de negócio**
* **DTO ≠ Entity**
* **Service orquestra, Repository persiste**
* **Validação ocorre antes do Service**

---

## 🧠 Camada 3 — Comunicação & Integração

### Regra de evolução obrigatória

1. Projeto começa **monólito**
2. Eventos são introduzidos
3. Serviços podem ser extraídos sem refatoração brutal

### Stack padrão

| Responsabilidade | Tecnologia          |
| ---------------- | ------------------- |
| Mensageria       | RabbitMQ            |
| Eventos          | Event-driven        |
| Tempo real       | WebSocket (Gateway) |

### Regra fundamental

> **HTTP é síncrono, eventos são assíncronos. Nunca misturar responsabilidades.**

---

## 🗄️ Camada 4 — Banco de Dados

### Regras universais

* PostgreSQL como padrão
* Migrations obrigatórias
* Entidades **sem lógica complexa**
* Auditoria simplificada quando aplicável

### Stack

```txt
PostgreSQL
TypeORM Migrations
```

---

## 🐳 Camada 5 — Infraestrutura (Obrigatória)

### Stack mínima

```txt
Docker
Docker Compose
```

### Regras fixas

* Nenhum projeto roda fora do Docker
* `.env.example` obrigatório
* Serviços isolados por container
* Banco e broker sempre containerizados

---

## 📦 Camada 6 — Monorepo (Regra de Escala)

### Quando usar

* Full-stack
* Mais de um serviço
* Código compartilhado

### Stack padrão

```txt
Turborepo
```

### Pacotes obrigatórios

```txt
packages/
  types
  utils
  eslint-config
  tsconfig
```

---

## 📚 Camada 7 — Qualidade & DX

### Obrigatório

| Item             | Regra        |
| ---------------- | ------------ |
| Swagger          | Sempre ativo |
| Logs             | Estruturados |
| Health check     | /health      |
| Lint             | Centralizado |
| Build previsível | Sem hacks    |

### Diferencial (mas recomendado)

* Testes unitários
* Rate limiting
* CI básico

---

## 🔁 Regra de Atualização de Projetos Antigos

Sempre seguir esta ordem:

1. **Migrar para TypeScript**
2. **Adicionar Zod + react-hook-form**
3. **Padronizar fetch com TanStack Query**
4. **Isolar estado global (Zustand)**
5. **Dockerizar**
6. **Documentar arquitetura**

Se um projeto antigo **não atende a esses pontos**, ele **não está atualizado**.

---

## 🧠 Regra de Especialização (Importante)

> Você **não está escolhendo stacks**.
> Você está **criando um sistema operacional pessoal de projetos**.

Essa regra permite:

* Trocar framework sem perder arquitetura
* Defender decisões em entrevista
* Evoluir projetos simples → profissionais