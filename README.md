# Garagem Pro — Sistema de acompanhamento de oficina mecânica

Projeto Integrador · Grupo 3 · Programador Full-Stack · SENAI · 2026

## Problema e solução

Mecânicos e atendentes precisam responder repetidamente a clientes sobre o andamento do conserto. O Garagem Pro centraliza clientes, veículos, catálogo de serviços e ordens de serviço. Um cliente pode consultar o andamento do veículo **pela placa, sem login**. O painel administrativo exige autenticação.

## Integrantes e módulos

A distribuição abaixo vem do README anterior do grupo; confirme com os colegas eventuais mudanças antes da entrega.

| Integrante | Módulo | Papel transversal |
| --- | --- | --- |
| Vitor | Veículos | PO / Scrum Master |
| Julia | Clientes | Git e Integração |
| João | Ordens de Serviço | Segurança |
| Nicolas | Serviços e Valores | Testes e Qualidade |
| Cibely | Consulta Pública | UX/UI e Acessibilidade |
| Jhuly | Relatórios | Documentação e Apresentação |

## Tecnologias

- Angular 21, TypeScript e formulários reativos (front-end)
- NestJS 11, TypeScript, validação por DTOs e Swagger (API)
- MongoDB com Mongoose (persistência)
- JWT e hash bcrypt (autenticação)
- Jest para testes unitários

## Como executar localmente

1. Instale Node.js compatível, npm e MongoDB Community Server. Certifique-se de que o MongoDB está acessível em `127.0.0.1:27017`.
2. Na pasta `backend`, execute `npm install`.
3. Copie `backend/.env.example` para `backend/.env` e substitua os valores fictícios de `ADMIN_EMAIL`, `ADMIN_SENHA` e `JWT_SECRET` por credenciais próprias. **Nunca compartilhe o .env.**
4. Inicie o back-end com `npm run start:dev`. A API funciona em `http://localhost:3000/api/v1` e o Swagger em `http://localhost:3000/api/docs`.
5. Para criar o primeiro administrador, em outro terminal na pasta `backend`, execute `npx ts-node src/seed/admin.ts` (com MongoDB disponível).
6. Na pasta `frontend`, execute `npm install` e `npm start`. Abra `http://localhost:4200`.
7. Faça login no painel com as credenciais cadastradas; a consulta por placa é pública.

**Atenção:** `npm run seed` do código original não deve ser executado em um banco com dados importantes: ele pode recriar serviços. O script do primeiro administrador é separado. Não usamos `npm run seed` para provisionar todas as coleções neste estado do projeto.

## Testes e qualidade

Na pasta `backend`:

```sh
npm run build
npm test -- --runInBand
npm run test:cov -- --runInBand
npm run lint
```

Na pasta `frontend`: `npm run build`.

O código contém filtro global de exceções da Aula 14 com padrão uniforme de erro: `{ sucesso: false, status, message, caminho, dataHora }`. Falhas 5xx mostram mensagem amigável; detalhes técnicos são registrados no terminal da API. Os services registram operações relevantes sem imprimir senhas, CPF ou e-mail.

**Os resultados dos comandos devem ser anexados ao Plano de Testes após execução real.** Este README não declara que um build ou execução da versão final foi aprovada sem evidências.

## Módulos e acesso

| Recurso | Uso | Acesso |
| --- | --- | --- |
| Autenticação | Login com JWT | Público |
| Clientes | Cadastro, listagem, alteração e desativação | Administrador |
| Veículos | Cadastro, listagem, alteração, desativação e reativação | Administrador |
| Serviços | Catálogo e preços | Administrador |
| Ordens de Serviço | Atendimento e mudança de andamento | Administrador |
| Relatórios | Resumo e agregações | Administrador |
| Consulta da placa | Status, observação da última OS e serviços associados | Público |

As rotas REST e exemplos ficam em `http://localhost:3000/api/docs` e no documento `docs/contrato-api-rascunho.md`.

## Regras de negócio efetivamente implementadas

- Um veículo é vinculado a cliente ativo pelo identificador MongoDB.
- A placa é normalizada e não pode ser alterada depois do cadastro; duplicatas são bloqueadas.
- A desativação de clientes e veículos preserva seus registros no banco.
- Um veículo pode ter várias ordens em momentos diferentes, mas não duas ordens **em andamento** ao mesmo tempo.
- A transição para `Pronto` é feita pela ordem de serviço; o status visível ao público acompanha a última atualização do atendimento.
- A página pública **não inclui dados pessoais do cliente**, apenas dados do veículo e da OS atual/mais recente.

## Decisões técnicas (ADRs)

1. **MongoDB com referências:** a ordem de serviço guarda os IDs do veículo, cliente e serviços, evitando duplicar dados dos cadastros.
2. **Regra de status no back-end:** a alteração de uma OS é validada no service NestJS e atualiza também o veículo, em vez de depender de duas chamadas Angular.
3. **Consulta pública mínima:** endpoint específico para placa, sem token, não devolvendo dados pessoais do cliente.
4. **Tratamento uniforme de falhas:** filtro global, mensagens de erro claras no navegador e detalhes internos apenas no log.

.

## Documentos e evidências da entrega

- [Documentação e pendências da Aula 14](docs/aula-14-checklist.md)
- [Contrato da API — rascunho](docs/contrato-api-rascunho.md)
- [Plano de Testes — rascunho](docs/plano-testes-rascunho.md)
- [Manual do Usuário — rascunho](docs/manual-usuario-rascunho.md)
- [Roteiro de apresentação — rascunho](docs/roteiro-apresentacao-rascunho.md)
- Templates oficiais em `guia/templates/`, que devem ser preenchidos para entrega final, com capturas e resultados reais.

**Respostas às perguntas de verificação por integrante:** pendentes de conferência. Não atribuímos respostas individuais sem validação de seus autores.
