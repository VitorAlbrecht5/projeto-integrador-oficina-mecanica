import { VeiculosService } from './veiculos.service';
import { CriarVeiculoDto } from './dto/criar-veiculo.dto';
import { AtualizarVeiculoDto } from './dto/atualizar-veiculo.dto';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Model } from 'mongoose';
import { Veiculo } from './schemas/veiculo.schema';
import { Cliente } from '../clientes/schemas/cliente.schema';
import { OrdemServico } from '../ordens-servico/ordem-servico.schema';
import { Servico } from '../servicos/servico.schema';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

const idVeiculo = '507f1f77bcf86cd799439011';
const idCliente = '507f191e810c19729de860ea';

const veiculoMock = {
  _id: idVeiculo,
  placa: 'ABC1234',
  modelo: 'Fiat Uno',
  cor: 'Vermelho',
  ano: 2018,
  defeitoRelatado: 'Problema no motor',
  status: 'Na Fila',
  clienteId: idCliente,
  ativo: true,
};

const dados: CriarVeiculoDto = {
  placa: 'ABC1234',
  modelo: 'Fiat Uno',
  cor: 'Vermelho',
  ano: 2018,
  defeitoRelatado: 'Problema no motor',
  clienteId: idCliente,
};

describe('VeiculosService', () => {
  let service: VeiculosService;
  const veiculos = {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };
  const clientes = { findOne: jest.fn() };
  const ordens = { findOne: jest.fn() };
  const servicos = { find: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new VeiculosService(
      veiculos as unknown as Model<Veiculo>,
      clientes as unknown as Model<Cliente>,
      ordens as unknown as Model<OrdemServico>,
      servicos as unknown as Model<Servico>,
    );
    clientes.findOne.mockReturnValue({
      exec: jest
        .fn()
        .mockImplementation(() => ({ _id: idCliente, ativo: true })),
    });
  });

  it('lista veículos', async () => {
    veiculos.find.mockReturnValue({
      exec: jest.fn().mockImplementation(() => [veiculoMock]),
    });
    expect(await service.listar()).toEqual([veiculoMock]);
    expect(veiculos.find).toHaveBeenCalledWith({});
  });

  it('busca veículo pelo ID válido', async () => {
    veiculos.findById.mockReturnValue({
      exec: jest.fn().mockImplementation(() => veiculoMock),
    });
    expect(await service.buscarPorId(idVeiculo)).toEqual(veiculoMock);
  });

  it('cadastra veículo com cliente ativo', async () => {
    veiculos.create.mockImplementation(() => Promise.resolve(veiculoMock));
    expect(await service.criar(dados)).toEqual(veiculoMock);
    expect(clientes.findOne).toHaveBeenCalledWith({
      _id: idCliente,
      ativo: true,
    });
    expect(veiculos.create).toHaveBeenCalledWith(dados);
  });

  it('recusa cliente inexistente ou inativo', async () => {
    clientes.findOne.mockReturnValue({
      exec: jest.fn().mockImplementation(() => null),
    });
    await expect(service.criar(dados)).rejects.toThrow(BadRequestException);
    expect(veiculos.create).not.toHaveBeenCalled();
  });

  it('recusa clienteId que não é ObjectId', async () => {
    await expect(service.criar({ ...dados, clienteId: '1' })).rejects.toThrow(
      BadRequestException,
    );
    expect(veiculos.create).not.toHaveBeenCalled();
  });

  it('atualiza veículo existente', async () => {
    const alteracoes: AtualizarVeiculoDto = { status: 'Em Conserto' };
    veiculos.findById.mockReturnValue({
      exec: jest.fn().mockImplementation(() => veiculoMock),
    });
    veiculos.findByIdAndUpdate.mockReturnValue({
      exec: jest
        .fn()
        .mockImplementation(() => ({ ...veiculoMock, status: 'Em Conserto' })),
    });
    const resposta = await service.atualizar(idVeiculo, alteracoes);
    expect(resposta.status).toBe('Em Conserto');
    expect(veiculos.findByIdAndUpdate).toHaveBeenCalledWith(
      idVeiculo,
      alteracoes,
      { new: true, runValidators: true },
    );
  });

  it('bloqueia alteração da placa original', async () => {
    veiculos.findById.mockReturnValue({
      exec: jest.fn().mockImplementation(() => veiculoMock),
    });
    await expect(
      service.atualizar(idVeiculo, { placa: 'XYZ9876' }),
    ).rejects.toThrow(BadRequestException);
    expect(veiculos.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('bloqueia status Pronto sem ordem de serviço concluída', async () => {
    veiculos.findById.mockReturnValue({
      exec: jest.fn().mockImplementation(() => veiculoMock),
    });
    await expect(
      service.atualizar(idVeiculo, { status: 'Pronto' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('desativa sem excluir o veículo', async () => {
    veiculos.findByIdAndUpdate.mockReturnValue({
      exec: jest
        .fn()
        .mockImplementation(() => ({ ...veiculoMock, ativo: false })),
    });
    expect(await service.remover(idVeiculo)).toEqual({
      mensagem: 'Veículo desativado com sucesso.',
    });
    expect(veiculos.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it('reativa veículo desativado', async () => {
    veiculos.findByIdAndUpdate.mockReturnValue({
      exec: jest
        .fn()
        .mockImplementation(() => ({ ...veiculoMock, ativo: true })),
    });
    expect(await service.reativar(idVeiculo)).toEqual({
      mensagem: 'Veículo reativado com sucesso.',
    });
    expect(veiculos.findByIdAndUpdate).toHaveBeenCalledWith(
      idVeiculo,
      { ativo: true },
      { new: true, runValidators: true },
    );
  });

  it('retorna 404 para veículo inexistente', async () => {
    veiculos.findById.mockReturnValue({
      exec: jest.fn().mockImplementation(() => null),
    });
    await expect(service.buscarPorId(idVeiculo)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('consulta placa e status sem expor dados do cliente ou observações do veículo', async () => {
    const exec = jest.fn().mockImplementation(() => veiculoMock);
    const lean = jest.fn().mockReturnValue({ exec });
    const select = jest.fn().mockReturnValue({ lean });
    veiculos.findOne.mockReturnValue({ select });
    const execOrdem = jest.fn().mockImplementation(() => null);
    ordens.findOne.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({ exec: execOrdem }),
        }),
      }),
    });
    const resposta = await service.consultarPorPlaca('abc-1234');
    expect(resposta).toEqual({
      placa: 'ABC1234',
      modelo: 'Fiat Uno',
      status: 'Na Fila',
      imagemUrl: undefined,
      observacao: undefined,
      servicos: [],
      totalEstimado: 0,
    });
    expect(veiculos.findOne).toHaveBeenCalledWith({
      placa: 'ABC1234',
      ativo: true,
    });
    expect(select).toHaveBeenCalledWith('placa modelo status imagemUrl');
    expect(resposta).not.toHaveProperty('clienteId');
    expect(servicos.find).not.toHaveBeenCalled();
  });

  it('retorna serviços da última OS e calcula o total estimado', async () => {
    const idServico1 = '507f191e810c19729de860e1';
    const idServico2 = '507f191e810c19729de860e2';
    veiculos.findOne.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockImplementation(() => veiculoMock),
        }),
      }),
    });
    const execOrdem = jest.fn().mockImplementation(() => ({
      descricaoProblema: 'Revisão geral após diagnóstico',
      servicosIds: [idServico1, idServico2],
    }));
    const sort = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({ exec: execOrdem }),
      }),
    });
    ordens.findOne.mockReturnValue({ sort });
    const execServicos = jest.fn().mockImplementation(() => [
      { _id: idServico2, nome: 'Alinhamento', preco: 120.5 },
      { _id: idServico1, nome: 'Troca de óleo', preco: 89.9 },
    ]);
    servicos.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({ exec: execServicos }),
      }),
    });
    const resposta = await service.consultarPorPlaca('ABC1234');
    expect(resposta.servicos).toEqual([
      { nome: 'Troca de óleo', preco: 89.9 },
      { nome: 'Alinhamento', preco: 120.5 },
    ]);
    expect(resposta.totalEstimado).toBe(210.4);
    expect(resposta.observacao).toBe('Revisão geral após diagnóstico');
    expect(sort).toHaveBeenCalledWith({ dataEntrada: -1, _id: -1 });
    expect(ordens.findOne).toHaveBeenCalledWith({ veiculoId: idVeiculo });
  });

  it('impede placa duplicada', async () => {
    const erro = new Error('duplicada') as Error & { code: number };
    erro.code = 11000;
    veiculos.create.mockImplementation(() => Promise.reject(erro));
    await expect(service.criar(dados)).rejects.toThrow(ConflictException);
  });

  it('rejeita ano futuro além do permitido', async () => {
    await expect(
      service.criar({ ...dados, ano: new Date().getFullYear() + 2 }),
    ).rejects.toThrow(BadRequestException);
    expect(veiculos.create).not.toHaveBeenCalled();
  });
});
