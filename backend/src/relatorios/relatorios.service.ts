import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrdemServico } from '../ordens-servico/ordem-servico.schema';

export type PeriodoRelatorio = 'dia' | 'mes' | 'ano';
interface ContagemStatus {
  _id: string;
  total: number;
}
interface ContagemDia {
  _id: string;
  total: number;
}
export interface PontoGrafico {
  label: string;
  valor: number;
}

// Sempre usamos datas de calendário em São Paulo para o relatório da oficina.
const FUSO = 'America/Sao_Paulo';
function dataLocal(): Date {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: FUSO,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const obter = (nome: string) =>
    Number(partes.find((item) => item.type === nome)?.value);
  return new Date(
    Date.UTC(obter('year'), obter('month') - 1, obter('day'), 12),
  );
}
function maisDias(data: Date, dias: number): Date {
  const copia = new Date(data);
  copia.setUTCDate(copia.getUTCDate() + dias);
  return copia;
}
function chaveDia(data: Date): string {
  return data.toISOString().slice(0, 10);
}

@Injectable()
export class RelatoriosService {
  constructor(
    @InjectModel(OrdemServico.name)
    private readonly ordens: Model<OrdemServico>,
  ) {}

  async obterResumo(periodo: PeriodoRelatorio) {
    const hoje = dataLocal();
    const inicioAnual = new Date(
      Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth() - 11, 1),
    );
    // Agregação 1: totais reais das OS por status (histórico completo).
    const porStatus = await this.ordens
      .aggregate<ContagemStatus>([
        { $group: { _id: '$status', total: { $sum: 1 } } },
      ])
      .exec();
    // Agregação 2: OS finalizadas por dia nos últimos 12 meses.
    // updatedAt é a data da última atualização; como OS Pronto não é mais editável,
    // esta é a data de finalização para as ordens criadas na versão atual.
    const porDia = await this.ordens
      .aggregate<ContagemDia>([
        { $match: { status: 'Pronto', updatedAt: { $gte: inicioAnual } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$updatedAt',
                timezone: FUSO,
              },
            },
            total: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .exec();

    const contagem = new Map(porStatus.map((item) => [item._id, item.total]));
    const quantidadePorDia = new Map(
      porDia.map((item) => [item._id, item.total]),
    );
    const somar = (inicio: Date, dias: number) => {
      let total = 0;
      for (let i = 0; i < dias; i++) {
        total += quantidadePorDia.get(chaveDia(maisDias(inicio, i))) ?? 0;
      }
      return total;
    };
    let grafico: PontoGrafico[] = [];
    if (periodo === 'dia') {
      grafico = Array.from({ length: 7 }, (_, index) => {
        const dia = maisDias(hoje, index - 6);
        return {
          label: new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            timeZone: 'UTC',
          }).format(dia),
          valor: somar(dia, 1),
        };
      });
    } else if (periodo === 'mes') {
      grafico = Array.from({ length: 4 }, (_, index) => ({
        label: `Semana ${index + 1}`,
        valor: somar(maisDias(hoje, -27 + index * 7), 7),
      }));
    } else {
      grafico = Array.from({ length: 12 }, (_, index) => {
        const mes = new Date(
          Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth() - 11 + index, 1),
        );
        const prefixo = chaveDia(mes).slice(0, 7);
        const valor = [...quantidadePorDia.entries()].reduce(
          (total, [dia, n]) => total + (dia.startsWith(prefixo) ? n : 0),
          0,
        );
        return {
          label: new Intl.DateTimeFormat('pt-BR', {
            month: 'short',
            year: '2-digit',
            timeZone: 'UTC',
          }).format(mes),
          valor,
        };
      });
    }
    const finalizadas = contagem.get('Pronto') ?? 0;
    return {
      emAndamento:
        (contagem.get('Na Fila') ?? 0) +
        (contagem.get('Em Conserto') ?? 0) +
        (contagem.get('Aguardando Peça') ?? 0),
      finalizadas,
      totalAtendimentos: [...contagem.values()].reduce((a, b) => a + b, 0),
      grafico,
    };
  }
}
