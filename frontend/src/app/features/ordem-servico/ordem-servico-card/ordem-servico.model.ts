export type StatusOrdemServico =
  | 'Veículo recebido - Aguardando Avaliação'
  | 'Em manutenção'
  | 'Aguardando Peças'
  | 'Pronto para retirada';
  
export interface OrdemServico {
  _id: string;
  veiculoId: string;
  clienteId: number;
  descricaoProblema: string;
  status: StatusOrdemServico;
  dataEntrada: string;
}

export type OrdemServicoInput = Omit<OrdemServico, '_id'>;

export interface OrdemServicoExibicao extends OrdemServico {
  veiculo: string;
  placa: string;
  cliente: string;
}