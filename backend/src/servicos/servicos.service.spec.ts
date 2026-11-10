import { Test } from '@nestjs/testing';
import { ServicosService } from './servicos.service';
import { getModelToken } from '@nestjs/mongoose';
import { Servico } from './servico.schema';
import { NotFoundException } from '@nestjs/common';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';

void describe('ServicosService', () => {
  let service: ServicosService;

  const modelMock = {
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const modulo = await Test.createTestingModule({
      providers: [
        ServicosService,
        {
          provide: getModelToken(Servico.name),
          useValue: modelMock,
        },
      ],
    }).compile();

    service = modulo.get(ServicosService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve lançar NotFoundException ao buscar ID inexistente', async () => {
    modelMock.findById.mockReturnValue({
      exec: () => Promise.resolve(null),
    });

    await expect(service.buscarPorId('999')).rejects.toThrow(NotFoundException);
  });

  it('lista os serviços cadastrados', async () => {
    const servicos = [{ nome: 'Troca de óleo', preco: 90 }];
    modelMock.find.mockReturnValue({ exec: () => Promise.resolve(servicos) });
    await expect(service.listarTodos()).resolves.toEqual(servicos);
    expect(modelMock.find).toHaveBeenCalledWith();
  });

  it('atualiza um serviço existente', async () => {
    const alterado = { nome: 'Revisão', preco: 130 };
    modelMock.findByIdAndUpdate.mockReturnValue({
      exec: () => Promise.resolve(alterado),
    });
    await expect(service.atualizar('123', { preco: 130 })).resolves.toEqual(
      alterado,
    );
    expect(modelMock.findByIdAndUpdate).toHaveBeenCalledWith(
      '123',
      { preco: 130 },
      { new: true, runValidators: true },
    );
  });

  it('remove um serviço existente', async () => {
    modelMock.findByIdAndDelete.mockReturnValue({
      exec: () => Promise.resolve({ _id: '123' }),
    });
    await expect(service.remover('123')).resolves.toBeUndefined();
    expect(modelMock.findByIdAndDelete).toHaveBeenCalledWith('123');
  });

  it('recusa a remoção de um serviço inexistente', async () => {
    modelMock.findByIdAndDelete.mockReturnValue({
      exec: () => Promise.resolve(null),
    });
    await expect(service.remover('nao-existe')).rejects.toThrow(
      NotFoundException,
    );
  });
});
