export type StatusOrdemServico = 'Na Fila' | 'Em Conserto' | 'Aguardando Peça' | 'Pronto';
export interface OrdemServico {
  _id: string;
  veiculoId: string;
  clienteId: string;
  descricaoProblema: string;
  status: StatusOrdemServico;
  dataEntrada: string;
  servicosIds: string[];
}
export interface OrdemServicoInput {
  veiculoId: string;
  descricaoProblema: string;
  servicosIds: string[];
}
export interface OrdemServicoExibicao extends OrdemServico {
  veiculo: string;
  placa: string;
  cliente: string;
  ano?: number;
  cor?: string;
  imagemUrl?: string;
}
