> [!IMPORTANT]
> **Este é o repositório base do Projeto Integrador.** Antes de tudo, leia o [`COMECE-AQUI.md`](COMECE-AQUI.md).
> Depois do fork, este README passa a ser **do grupo**: apague este aviso e preencha as seções marcadas com ✏️.

# Oficina Mecânica — Projeto Integrador Sprint 5

**Grupo:** 3 · **Tema:** Oficina Mecânica
**Turma:** Programador Full-Stack · SENAI · 2026

## ✏️ Sobre o sistema

Um sistema web focado no acompanhamento de serviços automotivos. A oficina
atualiza rapidamente o status de conserto do veículo no sistema, e o cliente pode
consultar a situação em tempo real digitando apenas a placa do seu carro.

## Integrantes, módulos e papéis

| Aluno | Módulo | Papel transversal | GitHub |
| --- | --- | --- | --- |
| Vitor | Cadastro de Veículos | PO / Scrum Master | ✏️ |
| Julia | Cadastro de Clientes | Git e Integração | ✏️ |
| João | Ordem de Serviço (Fluxo de Estados) | Segurança | ✏️ |
| Nicolas | Cadastro de Serviços e Valores | Testes e Qualidade | ✏️ |
| Cibely | Busca Pública de Status | UX/UI e Acessibilidade | ✏️ |
| Jhuly | Relatórios | Documentação e Apresentação | ✏️ |

## Tecnologias

- **Front-end:** Angular 21 (standalone, signals, formulários reativos)
- **Back-end:** NestJS 11 (módulos, controllers, services, DTOs)
- **Banco:** MongoDB com Mongoose
- **Testes:** Jest · **Documentação da API:** Swagger

## Pré-requisitos

- Node.js 20.19+ ou 22.12+ (`node -v`)
- MongoDB Community rodando em `mongodb://localhost:27017` (`mongosh` para testar)
- Git e VS Code

## Como rodar.

```bash
# 1) Back-end
cd backend
npm install
copy .env.example .env      # no Linux/Mac: cp .env.example .env
npm run seed                # popula o banco com dados de exemplo
npm run start:dev           # API em http://localhost:3000/api/v1

# 2) Front-end (em outro terminal)
cd frontend
npm install
npm start                   # http://localhost:4200
```

- Documentação da API (Swagger): http://localhost:3000/api/docs
- Testes do back-end: `cd backend && npm test`

> Se o `npm install` mostrar o erro `Cannot read properties of null (reading 'edgesOut')`, rode `npx npm@11 install`.

## Estrutura de pastas

```
guia/                # material do professor: manual do tema, receitas, templates (não altere)
docs/                # documentos do grupo (visão, contrato, dicionário, testes...)
backend/
  src/
    common/          # código compartilhado (padrão de resposta, filtros)
    produtos/        # MÓDULO DE EXEMPLO — use como modelo
      dto/           # contratos de entrada (validação)
      schemas/       # estrutura do documento no MongoDB
      produtos.controller.ts
      produtos.service.ts        # regras de negócio
      produtos.service.spec.ts   # testes unitários
    seed/            # dados de exemplo
  testes-obrigatorios/  # testes da autenticação (aulas 12 e 13)
frontend/
  src/
    environments/    # apiUrl e usarMock
    estilos-do-grupo.css  # estilos do grupo (vencem o styles.css)
    app/
      core/          # código compartilhado (modelos de resposta e de referência)
      layout/        # cabeçalho e menu
      pages/         # telas gerais (início, 404)
      features/
        produtos/    # MÓDULO DE EXEMPLO — use como modelo
          services/  # contrato + mock + API
          produtos-lista/
          produto-form/
```

## ✏️ Regras de negócio implementadas

| Código | Regra | Módulo | Onde está (arquivo) |
| --- | --- | --- | --- |
| RN01 | ✏️ | ✏️ | ✏️ |

## ✏️ Perfis de acesso

| Perfil | O que pode fazer |
| --- | --- |
| ✏️ | ✏️ |

## ✏️ Decisões técnicas (ADRs)

Registre as decisões importantes: o que foi decidido, por quê e qual alternativa foi descartada.

1. ✏️

## ✏️ Limitações conhecidas e próximos passos

- ✏️

## ✏️ Respostas às perguntas de verificação do manual

Cada aluno responde às perguntas do seu módulo aqui ou em `docs/respostas-<nome>.md`.

## Material de apoio

- [`COMECE-AQUI.md`](COMECE-AQUI.md) — fork, clone e atualizações da base
- [`guia/`](guia/) — manual do tema, receitas, Manual de Construção e templates
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — branches, commits e Pull Requests
