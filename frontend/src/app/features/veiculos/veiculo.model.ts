
export interface Veiculo {
    _id: string;
    placa: string;
    modelo: string;
    cor: string;
    ano: number;
    defeitoRelatado: string;
    status: string;
    clienteId: number;
}

export type CriarVeiculoDTO = Omit<Veiculo, '_id'>;
