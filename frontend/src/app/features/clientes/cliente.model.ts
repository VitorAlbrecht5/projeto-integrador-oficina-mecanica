
/** Cliente como a API devolve. */
export interface Cliente {
  _id: string;
  nome: string;
  telefone: string;
  email: string;
  endereco?: string;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Dados enviados para criar ou editar um cliente. */
export interface ClienteEntrada {
  nome: string;
  telefone: string;
  email: string;
  endereco?: string;
  ativo?: boolean;
}
