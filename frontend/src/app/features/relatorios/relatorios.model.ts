export interface PontoGraficoRelatorio {
  label: string;
  valor: number;
}
export interface RelatorioOficina {
  emAndamento: number;
  finalizadas: number;
  totalAtendimentos: number;
  grafico: PontoGraficoRelatorio[];
}
export type PeriodoRelatorio = 'dia' | 'mes' | 'ano';
