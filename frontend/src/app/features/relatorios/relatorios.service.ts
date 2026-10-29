import { Injectable, signal } from '@angular/core';
import { RelatorioOficina } from './relatorios.model';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  // Simulando os dados vindos do sistema da oficina
  private dadosRelatorio = signal<RelatorioOficina>({
    veiculosAguardando: 5,
    veiculosConsertados: 12,
    totalAtendimentos: 17,
    faturamentoEstimado: 3450.00
  });

  async obterResumo(): Promise<RelatorioOficina> {
    await new Promise(r => setTimeout(r, 200)); // Simula delay de rede
    return this.dadosRelatorio();
  }
}