# CeltaPreto

> [!NOTE]
> Sistema web para gestão de aluguéis de automóveis: o cliente cria, consulta, modifica e cancela pedidos pela Internet, e os agentes (empresas e bancos) avaliam financeiramente cada pedido e executam o contrato.

<table>
  <tr>
    <td width="600px">
      <div align="justify">
        O <b>CeltaPreto</b> foi desenvolvido no <b>Laboratório 02</b> da disciplina de <b>Desenvolvimento e Integração de Aplicações Web (DIAW)</b>, do curso de Engenharia de Software da PUC Minas. O sistema centraliza o fluxo de aluguel de automóveis: cadastro e login obrigatórios, pedidos de aluguel com status acompanhável, análise financeira feita por agentes e contratos de crédito concedidos por bancos. O projeto segue a arquitetura <b>MVC</b> no back-end (Spring Boot), usa <b>React + Vite</b> no front-end e <b>Supabase (PostgreSQL)</b> como banco de dados, com a modelagem UML versionada junto ao código.
      </div>
    </td>
    <td width="250px">
      <div>
        <img src="docs/logo.png" alt="Logo do CeltaPreto" width="250px"/>
      </div>
    </td>
  </tr>
</table>

---

## 🚧 Status do Projeto

![Java](https://img.shields.io/badge/Java-25-007ec6?style=for-the-badge&logo=openjdk&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.x-007ec6?style=for-the-badge&logo=springboot&logoColor=white) ![Maven](https://img.shields.io/badge/Maven-build-007ec6?style=for-the-badge&logo=apachemaven&logoColor=white) ![React](https://img.shields.io/badge/React-Vite-007ec6?style=for-the-badge&logo=react&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-007ec6?style=for-the-badge&logo=supabase&logoColor=white)

🛠️ **Em desenvolvimento.** Modelagem e front-end em andamento; back-end e integração com o banco de dados nas próximas etapas.

---

## 📚 Índice
- [CeltaPreto](#celtapreto)
  - [🚧 Status do Projeto](#-status-do-projeto)
  - [📚 Índice](#-índice)
  - [🔗 Links Úteis](#-links-úteis)
  - [📝 Sobre o Projeto](#-sobre-o-projeto)
  - [✨ Funcionalidades Principais](#-funcionalidades-principais)
  - [🛠 Tecnologias Utilizadas](#-tecnologias-utilizadas)
    - [💻 Front-end](#-front-end)
    - [🖥️ Back-end](#️-back-end)
    - [🗄️ Banco de dados](#️-banco-de-dados)
  - [🏗 Arquitetura](#-arquitetura)
    - [Diagramas](#diagramas)
  - [🔧 Instalação e Execução](#-instalação-e-execução)
    - [Pré-requisitos](#pré-requisitos)
    - [🔑 Variáveis de Ambiente](#-variáveis-de-ambiente)
      - [Back-end (Spring Boot)](#back-end-spring-boot)
      - [Front-end (React, Vite)](#front-end-react-vite)
    - [📦 Instalação de Dependências](#-instalação-de-dependências)
      - [Front-end (React)](#front-end-react)
      - [Back-end (Spring Boot)](#back-end-spring-boot-1)
    - [💾 Banco de Dados (Supabase)](#-banco-de-dados-supabase)
    - [⚡ Como Executar a Aplicação](#-como-executar-a-aplicação)
      - [Terminal 1: Back-end (Spring Boot)](#terminal-1-back-end-spring-boot)
      - [Terminal 2: Front-end (React, Vite)](#terminal-2-front-end-react-vite)
  - [🚀 Deploy](#-deploy)
  - [📂 Estrutura de Pastas](#-estrutura-de-pastas)
  - [🎥 Demonstração](#-demonstração)
    - [🌐 Aplicação Web](#-aplicação-web)
  - [🔗 Documentações utilizadas](#-documentações-utilizadas)
  - [👥 Autores](#-autores)
  - [🤝 Contribuição](#-contribuição)
  - [🙏 Agradecimentos](#-agradecimentos)
  - [📄 Licença](#-licença)

---

## 🔗 Links Úteis
* 🌐 **Demo Online:** _em breve_
* 📖 **Documentação de modelagem:** [pasta `docs/`](./docs)
  > 📚 Casos de uso, histórias do usuário, diagramas de classes e de pacotes e wireframes.

---

## 📝 Sobre o Projeto

Gerir aluguéis de automóveis envolve vários participantes: o cliente que contrata, a empresa ou o banco que avalia a capacidade financeira e, muitas vezes, um banco que concede o crédito. Fazer isso sem um sistema centralizado dificulta acompanhar o andamento de cada pedido.

O **CeltaPreto** resolve isso oferecendo um ponto único pela Internet:

- O **cliente** mantém seus dados (identificação, profissão e até 3 rendimentos) e acompanha o status de cada pedido de aluguel.
- O **agente** (empresa ou banco) analisa financeiramente os pedidos e, com parecer positivo, executa o contrato.
- O **banco** pode conceder o contrato de crédito associado ao aluguel.

> 🌧️ **Sobre o nome:** "Celta Preto" é uma brincadeira com "céu tá preto". Por isso a logo é um carro em formato de nuvem, com chuvinha embaixo.

O projeto nasceu como trabalho acadêmico (DIAW, PUC Minas) e serve também como peça do portfólio profissional.

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação:** cadastro e login obrigatórios, com perfis de Cliente e Agente (Empresa ou Banco).
- 👤 **CRUD de cliente:** identificação (RG, CPF, nome, endereço), profissão e até 3 rendimentos com entidade empregadora.
- 📝 **Pedidos de aluguel:** o cliente cria, consulta, modifica e cancela pedidos e acompanha o status.
- 🚘 **Automóveis:** registro de matrícula, ano, marca, modelo e placa, com proprietário cliente, empresa ou banco.
- 🏦 **Contrato de crédito:** associação opcional a um banco agente.
- ✅ **Avaliação financeira:** parecer positivo ou negativo do agente sobre cada pedido.
- 📄 **Execução de contrato:** pedidos aprovados viram contrato de aluguel.

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end

* **Biblioteca:** React
* **Build Tool:** Vite
* **Roteamento e HTTP:** React Router, Axios

### 🖥️ Back-end

* **Linguagem:** Java (JDK 25)
* **Framework:** Spring Boot 4.0.x (arquitetura MVC)
* **Build e dependências:** Apache Maven
* **ORM:** Spring Data JPA (Hibernate)
* **Autenticação:** Spring Security com JWT

### 🗄️ Banco de dados

* **Supabase** (PostgreSQL)

---

## 🏗 Arquitetura

O sistema é dividido em dois subsistemas: gestão de pedidos e contratos, e construção dinâmica das páginas web. O back-end segue **MVC** em camadas e expõe uma API REST consumida pelo front-end React.

- **controller:** endpoints REST.
- **service:** regras de negócio (limite de 3 rendimentos, ciclo de vida do pedido, permissões por perfil).
- **repository:** acesso ao Supabase via Spring Data JPA.
- **model:** entidades e enums.
- **dto:** objetos de transferência.
- **security:** autenticação e autorização.

Ciclo de vida do pedido: **Em análise → Aprovado ou Reprovado → Contrato executado**, com **Cancelado** possível até a execução do contrato.

### Diagramas

| Diagrama | Arquivo |
| :---: | :---: |
| **Casos de Uso** | _em breve_ |
| **Classes** | _em breve_ |
| **Pacotes (Visão Lógica)** | _em breve_ |
| **Histórias do Usuário** | _em breve_ |
| **Wireframes** | [docs/wireframes](./docs/wireframes) |

---

## 🔧 Instalação e Execução

### Pré-requisitos

* **Java JDK:** versão **25**
* **Maven:** pelo wrapper `./mvnw` incluído no projeto
* **Node.js:** versão LTS (v18.x ou superior)
* **Gerenciador de pacotes:** npm ou yarn
* **Conta no Supabase** com um projeto criado

---

### 🔑 Variáveis de Ambiente

#### Back-end (Spring Boot)

Copie `backend/.env.example` e preencha com os dados do seu projeto Supabase.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `SERVER_PORT` | Porta do back-end. | `8080` |
| `SPRING_DATASOURCE_URL` | URL JDBC do Supabase (PostgreSQL). | `jdbc:postgresql://db.<ref-do-projeto>.supabase.co:5432/postgres` |
| `SPRING_DATASOURCE_USERNAME` | Usuário do banco. | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Senha do banco. | `sua-senha-aqui` |
| `JWT_SECRET` | Chave para assinatura dos tokens. | `chave_super_segura_base64` |
| `CORS_ALLOWED_ORIGIN` | Origem permitida do front-end. | `http://localhost:5173` |

#### Front-end (React, Vite)

Crie `frontend/.env` com o prefixo `VITE_`.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base da API. | `http://localhost:8080` |

---

### 📦 Instalação de Dependências

```bash
git clone <URL_DO_REPOSITORIO>
cd celtapreto
```

#### Front-end (React)

```bash
cd frontend
npm install
cd ..
```

#### Back-end (Spring Boot)

```bash
cd backend
./mvnw clean install
cd ..
```

---

### 💾 Banco de Dados (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Project Settings > Database**, copie os dados de conexão e preencha as variáveis `SPRING_DATASOURCE_*`.
3. As tabelas são criadas pelo Hibernate na primeira execução do back-end.

---

### ⚡ Como Executar a Aplicação

Execute em **dois terminais separados**.

#### Terminal 1: Back-end (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```
🚀 *O back-end estará disponível em **http://localhost:8080**.*

#### Terminal 2: Front-end (React, Vite)

```bash
cd frontend
npm run dev
```
🎨 *O front-end estará disponível em **http://localhost:5173**.*

---

## 🚀 Deploy

_A definir._

---

## 📂 Estrutura de Pastas

```
.
├── README.md
├── .gitignore
│
├── /docs                        # 📚 Modelagem: casos de uso, histórias, classes, pacotes e wireframes.
│
├── /frontend                    # 📁 Aplicação React + Vite
│   ├── .env.example
│   └── /src
│       ├── /components          # 🧱 Componentes reutilizáveis.
│       ├── /pages               # 📄 Telas da aplicação.
│       ├── /services            # 🔌 Chamadas à API.
│       ├── /context             # 🔐 Sessão do usuário.
│       └── /routes              # 🧭 Rotas protegidas.
│
└── /backend                     # 📁 Aplicação Spring Boot
    ├── .env.example
    ├── pom.xml
    └── /src/main/java/.../
        ├── /controller          # 🎮 Endpoints REST.
        ├── /service             # ⚙️ Regras de negócio.
        ├── /repository          # 🗄️ Acesso a dados (JPA).
        ├── /model               # 🧬 Entidades e enums.
        ├── /dto                 # ✉️ Objetos de transferência.
        └── /security            # 🛡️ Autenticação e autorização.
```

---

## 🎥 Demonstração

### 🌐 Aplicação Web

| Tela | Captura de Tela |
| :---: | :---: |
| **Login e Cadastro** | _em breve_ |
| **Meus Pedidos** | _em breve_ |
| **Novo Pedido** | _em breve_ |
| **Status do Pedido** | _em breve_ |
| **Meu Perfil (CRUD de cliente)** | _em breve_ |
| **Avaliação do Agente** | _em breve_ |

---

## 🔗 Documentações utilizadas

* 📖 [Spring Boot](https://docs.spring.io/spring-boot/index.html)
* 📖 [Spring Security](https://docs.spring.io/spring-security/reference/index.html)
* 📖 [React](https://react.dev/reference/react)
* 📖 [Vite](https://vitejs.dev/config/)
* 📖 [Supabase](https://supabase.com/docs)
* 📖 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

---

## 👥 Autores

| 👤 Nome | :octocat: GitHub | 💼 LinkedIn | 📤 E-mail |
|---------|-----------------|-------------|-----------|
| Rafael Torres | <div align="center"><a href="https://github.com/T0RR35"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/rafaeltorresmodesto"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:modestorresrafael"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |

---

## 🤝 Contribuição

1. Faça um `fork` do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3. Faça commit das mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`), seguindo o [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
4. Envie a branch (`git push origin feature/minha-feature`).
5. Abra um **Pull Request**.

---

## 🙏 Agradecimentos

* [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) - Pelo apoio institucional e estrutura acadêmica.
* [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) - Pelos ensinamentos na matéria de Desenvolvimento e Integração de Aplicações Web.

---

## 📄 Licença

Este projeto é distribuído sob a **Licença MIT**.

---