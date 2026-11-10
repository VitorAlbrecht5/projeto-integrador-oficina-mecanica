export interface Servico {
  _id: string;
  nome: string;
  descricao: string;
  preco: number;
  tempoEstimado: string;
}
export type ServicoEntrada = Omit<Servico, '_id'>;
