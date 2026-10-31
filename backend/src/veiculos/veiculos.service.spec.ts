import { VeiculosService } from './veiculos.service';
import { CriarVeiculoDto } from './dto/criar-veiculo.dto';
import { AtualizarVeiculoDto } from './dto/atualizar-veiculo.dto';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Model } from 'mongoose';
import { Veiculo } from './schemas/veiculo.schema';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('VeiculosService', () => {
  let service: VeiculosService;

  const mockVeiculoModel = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const veiculoMock = {
    _id: '123',
    placa: 'ABC-1234',
    modelo: 'Fiat Uno',
    cor: 'Vermelho',
    ano: 2018,
    defeitoRelatado: 'Problema no motor',
    status: 'Na Fila',
    clienteId: 1,
    ativo: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new VeiculosService(
      mockVeiculoModel as unknown as Model<Veiculo>,
    );
  });

  it('deve listar todos os veículos', async () => {
    mockVeiculoModel.find.mockReturnValue({
      exec: jest.fn().mockImplementation(() => [veiculoMock]),
    });

    const resultado = await service.listar();

    expect(resultado).toEqual([veiculoMock]);
    expect(mockVeiculoModel.find).toHaveBeenCalledWith({});
  });

  it('deve buscar um veículo pelo ID', async () => {
    mockVeiculoModel.findById.mockReturnValue({
      exec: jest.fn().mockImplementation(() => veiculoMock),
    });

    const resultado = await service.buscarPorId('123');

    expect(resultado).toEqual(veiculoMock);
    expect(mockVeiculoModel.findById).toHaveBeenCalledWith('123');
  });

  it('deve cadastrar um veículo', async () => {
    const dados = {
      placa: 'ABC-1234',
      modelo: 'Fiat Uno',
      cor: 'Vermelho',
      ano: 2018,
      defeitoRelatado: 'Problema no motor',
      clienteId: 1,
    } as CriarVeiculoDto;

    mockVeiculoModel.create.mockImplementation(() =>
      Promise.resolve(veiculoMock),
    );

    const resultado = await service.criar(dados);

    expect(resultado).toEqual(veiculoMock);
    expect(mockVeiculoModel.create).toHaveBeenCalledWith(dados);
  });

  it('deve atualizar um veículo', async () => {
    const dados: AtualizarVeiculoDto = { status: 'Em Conserto' };

    mockVeiculoModel.findById.mockReturnValue({
      exec: jest.fn().mockImplementation(() => veiculoMock),
    });

    mockVeiculoModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockImplementation(() => ({
        ...veiculoMock,
        status: 'Em Conserto',
      })),
    });

    const resultado = await service.atualizar('123', dados);

    expect(resultado?.status).toBe('Em Conserto');
    expect(mockVeiculoModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '123',
      dados,
      { new: true, runValidators: true },
    );
  });

  it('deve remover um veículo', async () => {
    mockVeiculoModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockImplementation(() => veiculoMock),
    });

    const resultado = await service.remover('123');

    expect(resultado).toEqual({
      mensagem: 'Veículo removido com sucesso.',
    });
    expect(mockVeiculoModel.findByIdAndDelete).toHaveBeenCalledWith('123');
  });

  it('deve lançar erro ao buscar um veículo inexistente', async () => {
    mockVeiculoModel.findById.mockReturnValue({
      exec: jest.fn().mockImplementation(() => null),
    });

    await expect(service.buscarPorId('999')).rejects.toThrow(NotFoundException);
  });

  it('deve lançar erro ao remover um veículo inexistente', async () => {
    mockVeiculoModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockImplementation(() => null),
    });

    await expect(service.remover('999')).rejects.toThrow(NotFoundException);
  });

  it('deve impedir o cadastro de veículo com placa duplicada', async () => {
    const dados = {
      placa: 'ABC-1234',
      modelo: 'Fiat Uno',
      cor: 'Vermelho',
      ano: 2018,
      defeitoRelatado: 'Problema no motor',
      clienteId: 1,
    } as CriarVeiculoDto;

    const erroDuplicidade = new Error('Placa duplicada') as Error & {
      code: number;
    };

    erroDuplicidade.code = 11000;

    mockVeiculoModel.create.mockImplementation(() =>
      Promise.reject(erroDuplicidade),
    );

    await expect(service.criar(dados)).rejects.toThrow(ConflictException);
  });

  it('deve impedir o cadastro de veículo com ano futuro inválido', async () => {
    const dados = {
      placa: 'XYZ-9876',
      modelo: 'Fiat Uno',
      cor: 'Vermelho',
      ano: new Date().getFullYear() + 2,
      defeitoRelatado: 'Problema no motor',
      clienteId: 1,
    } as CriarVeiculoDto;

    await expect(service.criar(dados)).rejects.toThrow(BadRequestException);

    expect(mockVeiculoModel.create).not.toHaveBeenCalled();
  });
});
