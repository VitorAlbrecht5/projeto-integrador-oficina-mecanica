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
});
