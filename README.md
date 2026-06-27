# Projeto Babysite

## Visão geral

O Babysite é uma aplicação web voltada para o cadastro e gestão de usuários relacionados a cuidados infantis, com foco em três perfis principais: responsáveis, babás e filhos. O backend foi estruturado em TypeScript com Express para expor uma API REST, utilizar Prisma como ORM e SQLite como banco de dados local.

Este documento descreve, com mais detalhes, como o backend está organizado, qual é a responsabilidade de cada parte do código e como o fluxo de requisições ocorre dentro da aplicação.

## Objetivo do backend

O backend é responsável por:
- receber e validar requisições da interface web;
- organizar as rotas da API;
- aplicar regras de negócio básicas;
- persistir e recuperar informações no banco de dados;
- servir arquivos estáticos do frontend quando necessário;
- tratar erros de forma padronizada.

## Arquitetura geral

A aplicação segue uma estrutura modular simples, dividida em camada de entrada, rotas, controladores, modelos e banco de dados.

O fluxo básico é este:

1. O servidor é iniciado em src/index.ts.
2. As rotas são montadas e registradas.
3. Cada requisição chega em um controller.
4. O controller chama um model.
5. O model acessa o Prisma e o banco de dados.
6. O resultado é devolvido ao cliente ou transformado em erro.

## Estrutura do projeto

Abaixo está a organização principal do backend:

- src/index.ts: ponto de entrada da aplicação.
- src/routes: definição das rotas da API.
- src/controllers: lógica de cada endpoint.
- src/models: operações de persistência e consulta.
- src/database: configuração do banco, migração e seed.
- src/middlewares: funções intermediárias de validação e tratamento de erro.
- src/errors: classes de erro personalizadas.
- prisma/: schema do Prisma e migrações.

## Detalhamento da pasta src

### 1. src/index.ts

Este é o ponto central da aplicação. Ele é responsável por:
- criar a instância do Express;
- configurar middlewares como CORS, JSON, Morgan e arquivos estáticos;
- registrar as rotas da API sob o prefixo /api;
- servir a página inicial quando o usuário acessa a raiz do site;
- executar a migração inicial e o seeding ao subir o servidor;
- ativar os middlewares de erro globais.

Em termos práticos, este arquivo é o responsável por “ligar” todos os módulos do backend e colocar o sistema no ar.

### 2. src/routes

A pasta routes contém as definições de rotas específicas do sistema. Cada arquivo representa um recurso da aplicação:

- usuario_routes.ts: endpoints relacionados a usuários.
- baba_routes.ts: endpoints relacionados a babás.
- pais_routes.ts: endpoints relacionados a responsáveis.
- filhos_routes.ts: endpoints relacionados a filhos.

Cada rota delega o processamento para um controller. Por exemplo, uma requisição POST para /api/usuarios é roteada para o controller responsável por criar usuários.

Esse padrão ajuda a manter o código organizado e facilita a expansão da API.

### 3. src/controllers

Os controllers são a camada de entrada para as requisições HTTP. Eles recebem os dados da requisição, executam a lógica básica e retornam uma resposta ao cliente.

Cada controller é responsável por uma entidade. Por exemplo:

- Usuario_controller.ts: lida com cadastro, login, leitura, atualização e remoção de usuários.
- baba_controller.ts: lida com as operações relacionadas às babás.
- pais_controller.ts: lida com os responsáveis.
- filhos_controller.ts: lida com os cadastros e consultas de filhos.

O fluxo interno de um controller normalmente é:

1. receber dados via req.body, req.params ou req.query;
2. chamar um model correspondente;
3. enviar uma resposta com status HTTP e corpo JSON;
4. capturar exceções e encaminhar para o middleware de erro.

Esse arquivo funciona como uma ponte entre a camada HTTP e a camada de dados.

### 4. src/models

Os models encapsulam as operações com o banco usando o Prisma. Eles representam a camada de acesso a dados da aplicação.

Cada model possui funções como:
- create: criar registro;
- read: listar registros;
- readById: consultar um registro específico;
- update: atualizar um registro;
- remove: excluir um registro;
- findByEmail: busca específica para login.

Exemplo de responsabilidade:
- o model de Usuario cuida das operações relacionadas aos usuários;
- o model de Baba cuida das operações da tabela baba;
- o model de Pais cuida da tabela pais;
- o model de Filhos cuida da tabela filhos.

Essa camada evita que a lógica do banco fique espalhada pelos controllers.

### 5. src/database

A pasta database concentra tudo que se relaciona com a persistência do sistema.

Principais arquivos:

- prisma.ts: inicializa o cliente do Prisma.
- database.ts: configura a conexão com o banco e a base de dados local.
- migration.ts: executa o SQL de migração inicial.
- seeders.ts: popula o banco com dados iniciais.
- seeders.json: contém os dados iniciais usados pelos seeders.

Essa pasta é essencial porque é onde o sistema “abre a porta” para o banco e prepara o ambiente de dados para o funcionamento da aplicação.

### 6. src/middlewares

Os middlewares são funções intermediárias executadas durante o ciclo de uma requisição.

No projeto existem dois principais:

- errorHandlers.ts: trata erros globais e transforma exceções em respostas HTTP adequadas.
- requireJsonContentType.ts: valida se requisições com corpo devem enviar o header Content-Type como application/json.

Esse tipo de camada é muito útil porque centraliza tarefas transversais, como autenticação futura, validações de entrada e tratamento de erro.

### 7. src/errors

A pasta errors contém classes personalizadas para padronizar respostas de erro.

O principal arquivo é HttpError.ts, que permite criar erros com:
- mensagem amigável;
- código HTTP associado.

Isso torna mais fácil identificar se um erro é de validação, de recurso não encontrado ou de falha interna.

## Fluxo completo de uma requisição

Considere o exemplo de um cadastro de usuário:

1. O frontend envia uma requisição POST para /api/usuarios.
2. A rota correspondente captura a chamada.
3. O controller recebe a requisição e lê os dados do body.
4. O controller chama o model Usuario.create.
5. O model usa o Prisma para inserir os dados no banco.
6. O Prisma retorna o objeto criado.
7. O controller devolve uma resposta JSON com status 201.
8. Se houver erro, o controller envia o erro para o middleware global.

Esse é o padrão geral que se repete em quase todo o backend.

## Modelos principais do banco

O projeto usa o Prisma para definir e manipular as entidades do sistema.

Os modelos principais são:

- Usuario: representa um usuário do sistema.
- Pais: representa um responsável.
- Baba: representa uma babá.
- Filhos: representa uma criança vinculada ao usuário.

Esses modelos são usados pelas operações CRUD e também pelo processo de seed ao subir a aplicação.

## Tratamento de erros

A aplicação tenta manter um fluxo de erro consistente. Quando alguma operação falha, o sistema pode:
- lançar um HttpError com mensagem e status adequado;
- capturar a exceção no controller;
- encaminhar para o middleware global;
- responder ao cliente com JSON e status HTTP.

Exemplo de comportamento:
- erro de validação: 400;
- recurso não encontrado: 404;
- erro interno: 500.

## Rotas principais da API

### Usuários
- GET /api/usuarios: lista usuários
- GET /api/usuarios/:id: busca um usuário pelo identificador
- POST /api/usuarios: cria um usuário
- POST /api/usuarios/login: autenticação básica
- PUT /api/usuarios/:id: atualiza um usuário
- DELETE /api/usuarios/:id: remove um usuário

### Babás
- GET /api/babas: lista babás
- GET /api/babas/:id: busca uma babá
- POST /api/babas: cadastra uma babá
- PUT /api/babas/:id: atualiza uma babá
- DELETE /api/babas/:id: remove uma babá

### Responsáveis
- GET /api/pais: lista responsáveis
- GET /api/pais/:id: busca um responsável
- POST /api/pais: cadastra um responsável
- PUT /api/pais/:id: atualiza um responsável
- DELETE /api/pais/:id: remove um responsável

### Filhos
- GET /api/filhos: lista filhos
- GET /api/filhos/:id: busca um filho
- POST /api/filhos: cadastra um filho
- PUT /api/filhos/:id: atualiza um filho
- DELETE /api/filhos/:id: remove um filho

## Tecnologias utilizadas

- TypeScript
- Express
- Prisma
- SQLite
- CORS
- Morgan
- dotenv

## Como executar

Instale as dependências:

```bash
npm install
```

Inicie o servidor:

```bash
npm start
```

O backend ficará disponível em:

```text
http://localhost:3000
```

## Observações importantes

- O projeto também serve páginas estáticas do frontend a partir da pasta public.
- A aplicação realiza migração inicial e seed ao iniciar, facilitando a primeira execução.
- O backend já está preparado para evoluir com mais validações, autenticação real e camada de serviços, se o projeto crescer.

