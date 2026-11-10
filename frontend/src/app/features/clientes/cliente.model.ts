export interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Cliente {
  _id: string;
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  email?: string;
  endereco: Endereco;
  observacoes?: string;
  ativo?: boolean;
  /** Compatibilidade temporária com os mocks antigos; remover ao integrar Veículos. */
  id?: number;
}

export type ClienteEntrada = Omit<Cliente, '_id' | 'id' | 'ativo'>;
