export type StatusOrdemServico = 'Na Fila' | 'Em Conserto' | 'Pronto';

export interface OrdemServico {
  _id?: string;
  id?: number;
  veiculo: string;
  placa: string;
  cliente: string;
  descricaoProblema?: string;
  status: StatusOrdemServico;
  dataEntrada?: string;
}

export type OrdemServicoInput = Omit<OrdemServico, '_id'>;