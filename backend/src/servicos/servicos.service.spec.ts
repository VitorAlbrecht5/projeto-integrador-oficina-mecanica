import { Test, TestingModule } from '@nestjs/testing';
import { ServicosService } from './servicos.service';
import { getModelToken } from '@nestjs/mongoose';
import { Servico } from './servico.schema';
import { NotFoundException } from '@nestjs/common';

describe('ServicosService', () => {
  let service: ServicosService;
  let model: any;

  const mockServicoModel = {
    new: jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue({ _id: '123', ...dto }),
    })),
    constructor: jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue({ _id: '123', ...dto }),
    })),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicosService,
        {
          provide: getModelToken(Servico.name),
          useValue: mockServicoModel,
        },
      ],
    }).compile();

    service = module.get<ServicosService>(ServicosService);
    model = module.get(getModelToken(Servico.name));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve lançar NotFoundException ao buscar ID inexistente', async () => {
    model.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.buscarPorId('999')).rejects.toThrow(NotFoundException);
  });
});