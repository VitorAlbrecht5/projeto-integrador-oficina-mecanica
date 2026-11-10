import { Model } from 'mongoose';
import { RelatoriosService } from './relatorios.service';
import { OrdemServico } from '../ordens-servico/ordem-servico.schema';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('RelatoriosService', () => {
  const aggregate = jest.fn();
  const model = { aggregate };
  let service: RelatoriosService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RelatoriosService(model as unknown as Model<OrdemServico>);
  });

  function configurar(
    status: { _id: string; total: number }[] = [],
    porDia: { _id: string; total: number }[] = [],
  ) {
    aggregate.mockReturnValueOnce({
      exec: jest.fn().mockImplementation(() => status),
    });
    aggregate.mockReturnValueOnce({
      exec: jest.fn().mockImplementation(() => porDia),
    });
  }

  it('retorna zeros quando não há ordens', async () => {
    configurar();
    const resultado = await service.obterResumo('mes');
    expect(resultado.emAndamento).toBe(0);
    expect(resultado.finalizadas).toBe(0);
    expect(resultado.totalAtendimentos).toBe(0);
    expect(resultado.grafico).toHaveLength(4);
  });

  it('agrega contagens reais de ordens por status', async () => {
    configurar([
      { _id: 'Na Fila', total: 3 },
      { _id: 'Em Conserto', total: 2 },
      { _id: 'Aguardando Peça', total: 1 },
      { _id: 'Pronto', total: 4 },
    ]);
    const resultado = await service.obterResumo('dia');
    expect(resultado.emAndamento).toBe(6);
    expect(resultado.finalizadas).toBe(4);
    expect(resultado.totalAtendimentos).toBe(10);
  });

  it('retorna sete dias no gráfico diário', async () => {
    configurar();
    const resultado = await service.obterResumo('dia');
    expect(resultado.grafico).toHaveLength(7);
    expect(resultado.grafico.every((p) => p.valor === 0)).toBe(true);
  });

  it('retorna doze meses no gráfico anual e usa agregação no banco', async () => {
    configurar();
    const resultado = await service.obterResumo('ano');
    expect(resultado.grafico).toHaveLength(12);
    expect(aggregate).toHaveBeenCalledTimes(2);
    expect(aggregate).toHaveBeenNthCalledWith(1, [
      { $group: { _id: '$status', total: { $sum: 1 } } },
    ]);
  });
});
