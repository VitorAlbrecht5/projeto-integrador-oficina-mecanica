const STATUS_EQUIVALENTES: Record<string, string> = {
  'na fila': 'Na Fila',
  'veículo recebido - aguardando avaliação': 'Na Fila',
  'em conserto': 'Em Conserto',
  'em manutenção': 'Em Conserto',
  'aguardando peça': 'Aguardando Peça',
  'aguardando peças': 'Aguardando Peça',
  pronto: 'Pronto',
  'pronto para retirada': 'Pronto',
};

export function normalizarStatusVeiculo(valor: unknown): unknown {
  if (typeof valor !== 'string') return valor;

  const status = valor.trim();

  return STATUS_EQUIVALENTES[status.toLowerCase()] ?? status;
}
