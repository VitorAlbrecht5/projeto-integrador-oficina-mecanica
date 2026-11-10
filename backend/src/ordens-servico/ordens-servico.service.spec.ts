import { BadRequestException, ConflictException } from '@nestjs/common';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Model, Types } from 'mongoose';
import { OrdemServico } from './ordem-servico.schema';
import { Veiculo } from '../veiculos/schemas/veiculo.schema';
import { Servico } from '../servicos/servico.schema';
import { OrdensServicoService } from './ordens-servico.service';

const veiculoId = new Types.ObjectId();
const clienteId = new Types.ObjectId();
const servicoId = new Types.ObjectId();
const osId = new Types.ObjectId();

describe('OrdensServicoService', () => {
  const osModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };
  const veiculoModel = { findOne: jest.fn(), findByIdAndUpdate: jest.fn() };
  const servicoModel = { countDocuments: jest.fn() };
  let service: OrdensServicoService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new OrdensServicoService(
      osModel as unknown as Model<OrdemServico>,
      veiculoModel as unknown as Model<Veiculo>,
      servicoModel as unknown as Model<Servico>,
    );
  });

  it('lista ordens com filtro de status', async () => {
    osModel.find.mockReturnValue({
      sort: () => ({ exec: () => Promise.resolve([]) }),
    });
    expect(await service.listar('Na Fila')).toEqual([]);
    expect(osModel.find).toHaveBeenCalledWith({ status: 'Na Fila' });
  });

  it('rejeita filtro de status inválido', () => {
    expect(() => service.listar('Encerrada')).toThrow(BadRequestException);
  });

  it('não abre OS para veículo inativo/inexistente', async () => {
    veiculoModel.findOne.mockReturnValue({
      exec: () => Promise.resolve(null),
    });
    await expect(
      service.criar({
        veiculoId: veiculoId.toString(),
        descricaoProblema: 'Problema',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('não permite duas ordens em andamento no mesmo veículo', async () => {
    veiculoModel.findOne.mockReturnValue({
      exec: () => Promise.resolve({ clienteId }),
    });
    osModel.findOne.mockReturnValue({
      exec: () => Promise.resolve({ _id: osId }),
    });
    await expect(
      service.criar({
        veiculoId: veiculoId.toString(),
        descricaoProblema: 'Problema',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('permite concluir diretamente de Na Fila sem serviços selecionados', async () => {
    const ordem = {
      _id: osId,
      veiculoId,
      clienteId,
      status: 'Na Fila' as const,
      servicosIds: [] as Types.ObjectId[],
    };
    osModel.findById.mockReturnValue({
      exec: () => Promise.resolve(ordem),
    });
    veiculoModel.findOne.mockReturnValue({
      exec: () => Promise.resolve({ _id: veiculoId, ativo: true }),
    });
    osModel.findByIdAndUpdate.mockReturnValue({
      exec: () => Promise.resolve({ ...ordem, status: 'Pronto' }),
    });
    veiculoModel.findByIdAndUpdate.mockReturnValue({
      exec: () => Promise.resolve({ _id: veiculoId }),
    });
    const resultado = await service.atualizar(osId.toString(), {
      status: 'Pronto',
    });
    expect(resultado.status).toBe('Pronto');
    expect(osModel.findByIdAndUpdate).toHaveBeenCalledWith(
      osId.toString(),
      expect.objectContaining({ status: 'Pronto' }),
      expect.objectContaining({ new: true, runValidators: true }),
    );
    expect(veiculoModel.findByIdAndUpdate).toHaveBeenCalledWith(
      veiculoId,
      { status: 'Pronto' },
      { runValidators: true },
    );
  });

  it('marca Pronto sem checkboxes e atualiza status do veículo', async () => {
    const ordem = {
      _id: osId,
      veiculoId,
      clienteId,
      status: 'Em Conserto' as const,
      servicosIds: [servicoId],
      servicosConcluidos: false,
      verificacaoFinal: false,
    };
    osModel.findById.mockReturnValue({
      exec: () => Promise.resolve(ordem),
    });
    servicoModel.countDocuments.mockReturnValue({
      exec: () => Promise.resolve(1),
    });
    veiculoModel.findOne.mockReturnValue({
      exec: () => Promise.resolve({ _id: veiculoId, ativo: true }),
    });
    osModel.findByIdAndUpdate.mockReturnValue({
      exec: () => Promise.resolve({ ...ordem, status: 'Pronto' }),
    });
    veiculoModel.findByIdAndUpdate.mockReturnValue({
      exec: () => Promise.resolve({ _id: veiculoId }),
    });
    const resultado = await service.atualizar(osId.toString(), {
      status: 'Pronto',
    });
    expect(resultado.status).toBe('Pronto');
    expect(veiculoModel.findByIdAndUpdate).toHaveBeenCalled();
  });
});
