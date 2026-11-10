# Contrato da API — Garagem Pro

Base URL: `http://localhost:3000/api/v1`; Swagger: `http://localhost:3000/api/docs`.

Respostas de sucesso, exceto rotas sem corpo 204: `{ "sucesso": true, "dados": ... }`. Erros (Aula 14): `{ "sucesso": false, "status": 400, "message": "...", "caminho": "/api/v1/...", "dataHora": "..." }`.

| Verbo  | Rota                             | Uso                                                                          | Autenticação |
| ------ | -------------------------------- | ---------------------------------------------------------------------------- | ------------ |
| POST   | `/auth/login`                    | Login, emite JWT                                                             | Pública      |
| GET    | `/clientes`                      | Lista clientes ativos                                                        | Admin        |
| GET    | `/clientes/:id`                  | Consulta cliente                                                             | Admin        |
| POST   | `/clientes`                      | Cadastra cliente                                                             | Admin        |
| PATCH  | `/clientes/:id`                  | Atualiza cliente                                                             | Admin        |
| DELETE | `/clientes/:id`                  | Desativa cliente                                                             | Admin        |
| GET    | `/veiculos`                      | Lista veículos, pode filtrar por placa                                       | Admin        |
| GET    | `/veiculos/:id`                  | Consulta veículo                                                             | Admin        |
| POST   | `/veiculos`                      | Cadastra veículo                                                             | Admin        |
| PATCH  | `/veiculos/:id`                  | Atualiza veículo                                                             | Admin        |
| PATCH  | `/veiculos/:id/reativar`         | Reativa veículo                                                              | Admin        |
| DELETE | `/veiculos/:id`                  | Desativa veículo                                                             | Admin        |
| GET    | `/veiculos/consulta/:placa`      | Status, observação, serviços e custo estimado, sem dados pessoais de cliente | Pública      |
| GET    | `/servicos`                      | Lista catálogo                                                               | Admin        |
| GET    | `/servicos/:id`                  | Consulta serviço                                                             | Admin        |
| POST   | `/servicos`                      | Cadastra serviço                                                             | Admin        |
| PUT    | `/servicos/:id`                  | Atualiza serviço (compatibilidade front-end)                                 | Admin        |
| DELETE | `/servicos/:id`                  | Exclui serviço definitivamente                                               | Admin        |
| GET    | `/ordens-servico`                | Lista OS, pode filtrar por status                                            | Admin        |
| GET    | `/ordens-servico/:id`            | Consulta OS                                                                  | Admin        |
| POST   | `/ordens-servico`                | Inicia atendimento                                                           | Admin        |
| PATCH  | `/ordens-servico/:id`            | Atualiza atendimento/status                                                  | Admin        |
| GET    | `/relatorios/resumo?periodo=mes` | Resumo e gráfico (dia, mes ou ano)                                           | Admin        |

**Corpos e exemplos:** usar os DTOs anotados no Swagger para cadastrar Clientes, Veículos, Serviços e OS. Rotas com token precisam do header `Authorization: Bearer <token>`.

**Códigos comuns:** 200/201 sucesso, 204 exclusão sem corpo, 400 validação, 401 sem autenticação, 403 permissão, 404 ausente, 409 conflito, 500 erro inesperado.
