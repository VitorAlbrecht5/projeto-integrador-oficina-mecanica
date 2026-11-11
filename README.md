# Garagem Pro — Projeto Integrador Sprint 5

**Grupo 3 · Oficina Mecânica · Programador Full-Stack · SENAI · 2026**

## Sobre o sistema

O Garagem Pro organiza os atendimentos de uma oficina mecânica. O administrador cadastra clientes, veículos e serviços, abre ordens de serviço e atualiza o andamento do conserto. O cliente consulta a situação do veículo pela placa, sem precisar criar uma conta ou fazer login.

O MVP inclui o painel administrativo, a consulta pública e os relatórios de atendimentos. Estoque de peças, pagamentos on-line, chat e taxa de pátio ficam fora do escopo atual.

## Integrantes, módulos e papéis

| Integrante | Módulo                               | Papel transversal           | GitHub                                                      |
| ---------- | ------------------------------------ | --------------------------- | ----------------------------------------------------------- |
| Vitor      | Cadastro de Veículos                 | PO / Scrum Master           | [VitorAlbrecht5](https://github.com/VitorAlbrecht5)         |
| Julia      | Cadastro de Clientes                 | Git e Integração            | [Julia-danielle](https://github.com/Julia-danielle)         |
| João       | Ordens de Serviço e Fluxo de Estados | Segurança                   | [joaooliveira0906](https://github.com/joaooliveira0906)     |
| Nicolas    | Cadastro de Serviços e Valores       | Testes e Qualidade          | [Nicolas-Hoffmann21](https://github.com/Nicolas-Hoffmann21) |
| Cibely     | Busca Pública de Status              | UX/UI e Acessibilidade      | [Cibely02](https://github.com/Cibely02)                     |
| Jhuly      | Relatórios                           | Documentação e Apresentação | [Nicolas-Hoffmann21](https://github.com/Nicolas-Hoffmann21) |

## Tecnologias

- **Front-end** com Angular 21, TypeScript, componentes standalone, signals e formulários reativos.
- **Back-end** com NestJS 11, validação por DTOs e documentação da API no Swagger.
- **Banco de dados** MongoDB com Mongoose.
- **Autenticação** com JWT e senhas armazenadas com hash bcrypt.
- **Testes automatizados** com Jest.

## Pré-requisitos

- Node.js 20.19+ na série 20, 22.12+ na série 22 ou 24+, com npm. O workflow do GitHub usa Node.js 22.
- MongoDB Community rodando localmente em `127.0.0.1:27017`.
- Git.

## Como rodar

### 1. Back-end

Na raiz do repositório, abra um terminal e instale as dependências.

```powershell
cd backend
npm ci
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

No Linux ou macOS, use `test -f .env || cp .env.example .env` para criar o arquivo se ele ainda não existir.

No `backend/.env`, preencha `ADMIN_EMAIL` e `ADMIN_SENHA` com as credenciais que você vai usar no painel. Defina um `JWT_SECRET` próprio com pelo menos 32 caracteres. O endereço padrão do banco é `mongodb://127.0.0.1:27017/oficina`. Mantenha o `.env` fora do Git.

Com o MongoDB ligado, rode os comandos abaixo na pasta `backend`.

```powershell
npm run seed
npm run start:dev
```

O seed cria o administrador inicial e carrega dados fictícios para demonstração. Se já houver um administrador com o e-mail informado, o seed preserva a senha cadastrada.

### 2. Front-end

Abra outro terminal na raiz do repositório.

```powershell
cd frontend
npm ci
npm start
```

| Recurso              | Endereço                                                  |
| -------------------- | --------------------------------------------------------- |
| Consulta pública     | [localhost:4200](http://localhost:4200/)                  |
| Login administrativo | [localhost:4200/login](http://localhost:4200/login)       |
| API REST             | `http://localhost:3000/api/v1`                            |
| Swagger              | [localhost:3000/api/docs](http://localhost:3000/api/docs) |

Para testar a consulta pública após rodar o seed, pesquise a placa `IAB1A01`.

## Estrutura de pastas

```text
backend/
  src/
    auth/                # login e controle de acesso
    usuarios/            # contas administrativas
    clientes/            # cadastro dos responsáveis pelos veículos
    veiculos/            # cadastro e consulta pública por placa
    servicos/            # catálogo de serviços e valores
    ordens-servico/      # atendimentos e fluxo de estados
    relatorios/          # indicadores de atendimentos
    common/              # padrão de respostas e filtro global de erros
    seed/                # administrador inicial e dados de demonstração
  testes-obrigatorios/   # testes de referência das aulas de autenticação
frontend/
  src/app/features/      # telas e serviços de cada módulo
  src/app/layout/        # navegação do painel
  src/environments/      # configuração de ambiente
docs/                    # documentação do grupo
guia/                    # manuais, exemplos e modelos do professor
```

## Regras de negócio implementadas

| Módulo            | Regra                                                                                                                                                                                                         | Onde está                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Clientes          | O CPF é único. A desativação preserva o cadastro e retira o cliente da listagem de ativos.                                                                                                                    | [Serviço de Clientes](backend/src/clientes/clientes.service.ts) · [Schema de Clientes](backend/src/clientes/schemas/cliente.schema.ts) |
| Veículos          | O cadastro exige um cliente ativo. A placa é única, fica em maiúsculas e sem hífen e é fixa após o cadastro. O ano pode ir até o ano atual mais um. Veículos desativados precisam ser reativados para edição. | [Serviço de Veículos](backend/src/veiculos/veiculos.service.ts) · [Schema de Veículos](backend/src/veiculos/schemas/veiculo.schema.ts) |
| Serviços          | O cadastro exige nome, descrição, tempo estimado e preço maior ou igual a zero.                                                                                                                               | [DTO de Serviços](backend/src/servicos/criar-servico.dto.ts)                                                                           |
| Ordens de Serviço | O atendimento começa em `Na Fila`, exige um veículo ativo e é bloqueado quando já existe uma OS em andamento para o veículo. A OS marcada como `Pronto` fica fechada para edição.                             | [Serviço de Ordens de Serviço](backend/src/ordens-servico/ordens-servico.service.ts)                                                   |
| Consulta Pública  | A placa identifica um veículo ativo. A consulta retorna o status, a observação da OS mais recente e os serviços vinculados com o total estimado, sem os dados cadastrais do cliente.                          | [Consulta por placa](backend/src/veiculos/veiculos.service.ts)                                                                         |
| Relatórios        | Os indicadores são calculados a partir das ordens gravadas no MongoDB. O gráfico permite consultar as finalizações dos últimos 7 dias, 4 semanas ou 12 meses.                                                 | [Serviço de Relatórios](backend/src/relatorios/relatorios.service.ts)                                                                  |

O administrador pode mover uma OS entre `Na Fila`, `Em Conserto`, `Aguardando Peça` e `Pronto` conforme as transições abaixo. O back-end atualiza o status do veículo quando o atendimento é aberto ou alterado.

| Estado atual      | Próximos estados permitidos                |
| ----------------- | ------------------------------------------ |
| `Na Fila`         | `Em Conserto`, `Aguardando Peça`, `Pronto` |
| `Em Conserto`     | `Aguardando Peça`, `Pronto`                |
| `Aguardando Peça` | `Em Conserto`, `Pronto`                    |
| `Pronto`          | Estado final                               |

## Perfis de acesso

| Acesso        | Permissões                                                                            | Rotas da API                                                             |
| ------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Público       | Consultar a situação do veículo pela placa e acessar o endpoint de login.             | `GET /veiculos/consulta/:placa` e `POST /auth/login`                     |
| Administrador | Gerenciar clientes, veículos, serviços e ordens de serviço e consultar os relatórios. | `/clientes`, `/veiculos`, `/servicos`, `/ordens-servico` e `/relatorios` |

As rotas administrativas exigem um JWT no cabeçalho `Authorization: Bearer <token>`. O Angular guarda o token na sessão do navegador. O login do painel é reservado ao administrador.

## Decisões técnicas (ADRs)

| Decisão                                                                             | Motivo                                                                                          | Alternativa técnica                                    |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Referenciar clientes, veículos e serviços pelos IDs do MongoDB.                     | Reaproveitar os cadastros em vários atendimentos e reduzir a duplicação de dados.               | Embutir cópias dos cadastros em cada ordem de serviço. |
| Validar transições e atualizar o status do veículo no serviço de Ordens de Serviço. | Centralizar a regra na API para que o painel e a consulta pública acompanhem o mesmo andamento. | Fazer duas atualizações separadas a partir do Angular. |
| Expor uma rota pública específica para consulta por placa.                          | Permitir o acompanhamento sem conta e limitar os campos retornados.                             | Reaproveitar o endpoint administrativo de veículos.    |
| Usar um filtro global de exceções no NestJS.                                        | Padronizar as respostas de erro e manter os detalhes técnicos no log do servidor.               | Formatar as mensagens de erro em cada controller.      |

## Testes e qualidade

Rode os comandos abaixo na pasta `backend`.

```powershell
npm test -- --runInBand
npm run test:cov -- --runInBand
npx eslint "src/**/*.ts"
npm run build
```

O relatório de cobertura fica em `backend/coverage/lcov-report/index.html`. O Plano de Testes reúne os cenários de validação e os resultados já registrados.

Na pasta `frontend`, execute `npm run build` para verificar o build de produção.

## Limitações conhecidas e próximos passos

- O catálogo permite exclusão definitiva. O próximo passo é preservar serviços já vinculados a ordens e seus valores no histórico.
- A validação do tempo de resposta da consulta por placa em rede móvel está pendente.
- O build de produção ainda exige um ajuste no tamanho do CSS da página pública. O lint do back-end aponta um import sem uso no seed.

## Respostas às perguntas de verificação do manual

Cada integrante registra as respostas do seu módulo em `docs/respostas-<nome>.md`.

## Documentação e material de apoio

- [Documento de Visão](docs/documento-de-visao.pdf) e [wireframe da consulta pública](docs/wireframe.jpg).
- [Contrato da API](docs/contrato-api.md) e [Plano de Testes](docs/plano-de-testes.docx).
- [Manual do Usuário](docs/manual-do-usuario.docx).
- [Dicionário de Dados](docs/dicionario-de-dados.docx).
- [Roteiro da Apresentação](docs/roteiro-da-apresentacao.docx).
- [COMECE-AQUI.md](COMECE-AQUI.md), [guia do professor](guia/) e [orientações de contribuição](CONTRIBUTING.md).
