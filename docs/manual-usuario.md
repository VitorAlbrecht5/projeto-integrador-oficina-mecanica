# Manual do Usuário — Garagem Pro (rascunho)


## 1. Acesso administrativo

Abra `http://localhost:4200/login`. Use o e-mail e a senha do administrador cadastrado. O painel contém links para Clientes, Veículos, Serviços, Ordens de Serviço e Relatórios. Ao encerrar o trabalho, use a opção Sair.

## 2. Clientes

Em Clientes, selecione a opção de cadastro, informe nome, CPF, telefone e endereço; e-mail e observações são opcionais se assim apresentados no formulário. Salve e confira na listagem. Use a edição para corrigir dados e a desativação para preservar o histórico sem manter o cliente ativo.

## 3. Veículos

Cadastre o veículo, vinculando-o a um cliente existente; informe placa, modelo, cor, ano e defeito relatado. A placa é normalizada automaticamente e não pode ser alterada após o cadastro. A tela permite editar e desativar/reativar.

## 4. Serviços

O catálogo registra nome, descrição, preço e tempo estimado. Esses itens podem ser vinculados a atendimentos e servem para calcular o total estimado mostrado na consulta pública.

## 5. Ordens de Serviço (Atendimentos)

Escolha Iniciar atendimento, vincule um veículo e informe as observações e serviços. O mesmo veículo pode voltar para novos atendimentos, mas não pode ter dois atendimentos em andamento ao mesmo tempo. Atualize o andamento conforme o serviço avança. No modelo atualmente implementado, selecionar `Pronto` conclui a OS diretamente.

## 6. Consulta pública sem login

Na página inicial, informe a placa do veículo para consultar seu andamento. São exibidas as etapas do atendimento, as observações da OS mais recente e, se houver, os serviços associados com valor total estimado. Não há necessidade de cadastrar conta.

## 7. Relatórios

No painel, acesse Relatórios para visualizar totais de atendimentos e finalizações agrupadas pelo período selecionado.

## 8. Mensagens de erro

Se uma ação falhar, o sistema deve exibir erro amigável. Mensagens de validação informam campos inválidos; erros internos não mostram detalhes técnicos ao usuário. Para problemas persistentes, procure a administração do sistema.
