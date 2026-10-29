export interface Veiculo {
  _id: string;
  placa: string;
  modelo: string;
  cor: string;
  ano: number;
  defeitoRelatado: string;
  status: string;
  clienteId: number;
  ativo: boolean;
  imagemUrl?: string;
}

export type CriarVeiculoDTO = Omit<Veiculo, '_id' | 'ativo'>;