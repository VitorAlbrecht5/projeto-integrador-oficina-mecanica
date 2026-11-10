import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Cliente } from './schemas/cliente.schema';
import { ClientesService } from './clientes.service';

const ID = '507f1f77bcf86cd799439011';
const cliente = {
  _id: ID,
  nomeCompleto: 'Mariana',
  cpf: '12345678909',
  ativo: true,
};
const dados = {
  nomeCompleto: 'Mariana',
  cpf: '12345678909',
  telefone: '51999998888',
  endereco: {
    cep: '93210100',
    rua: 'Rua Um',
    numero: '1',
    bairro: 'Centro',
    cidade: 'Esteio',
    estado: 'RS',
  },
};

describe('ClientesService', () => {
  let service: ClientesService;
  const model = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const modulo = await Test.createTestingModule({
      providers: [
        ClientesService,
        { provide: getModelToken(Cliente.name), useValue: model },
      ],
    }).compile();
    service = modulo.get(ClientesService);
  });

  it('lista apenas clientes ativos', async () => {
    const exec = jest.fn().mockResolvedValue([cliente]);
    const sort = jest.fn().mockReturnValue({ exec });
    model.find.mockReturnValue({ sort });
    expect(await service.listar()).toEqual([cliente]);
    expect(model.find).toHaveBeenCalledWith({ ativo: true });
  });

  it('busca um cliente por ID', async () => {
    model.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(cliente),
    });
    expect(await service.buscarPorId(ID)).toEqual(cliente);
  });

  it('rejeita ID inválido', async () => {
    await expect(service.buscarPorId('nao-e-um-id')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('cadastra um cliente', async () => {
    model.create.mockResolvedValue(cliente);
    expect(await service.criar(dados)).toEqual(cliente);
    expect(model.create).toHaveBeenCalledWith(dados);
  });

  it('bloqueia CPF repetido', async () => {
    model.create.mockRejectedValue({ code: 11000 });
    await expect(service.criar(dados)).rejects.toThrow(ConflictException);
  });

  it('altera um cliente existente', async () => {
    model.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(cliente),
    });
    model.findOneAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ ...cliente, nomeCompleto: 'Maria' }),
    });
    const atualizado = await service.atualizar(ID, { nomeCompleto: 'Maria' });
    expect(atualizado.nomeCompleto).toBe('Maria');
  });

  it('desativa sem excluir fisicamente', async () => {
    model.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(cliente),
    });
    model.findOneAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ ...cliente, ativo: false }),
    });
    expect(await service.desativar(ID)).toEqual({
      mensagem: 'Cliente desativado com sucesso.',
    });
    expect(model.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: ID, ativo: true },
      { ativo: false },
      { new: true, runValidators: true },
    );
  });

  it('não desativa cliente inexistente', async () => {
    model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    await expect(service.desativar(ID)).rejects.toThrow(NotFoundException);
  });
});
