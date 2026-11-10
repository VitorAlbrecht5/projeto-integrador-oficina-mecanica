import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodoRelatorio, RelatorioOficina } from '../relatorios.model';
import { RelatorioService } from '../relatorios.service';

@Component({
  selector: 'app-relatorio-painel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatorios-painel.html',
  styleUrls: ['./relatorios-painel.css'],
})
export class RelatorioPainel implements OnInit {
  private readonly relatorios = inject(RelatorioService);
  filtroAtivo = signal<PeriodoRelatorio>('mes');
  dados = signal<RelatorioOficina | null>(null);
  carregando = signal(false);
  erro = signal('');

  ngOnInit() { this.carregar('mes'); }

  alterarFiltro(periodo: PeriodoRelatorio) {
    if (periodo !== this.filtroAtivo()) this.carregar(periodo);
  }

  carregar(periodo: PeriodoRelatorio) {
    this.filtroAtivo.set(periodo);
    this.carregando.set(true);
    this.erro.set('');
    this.relatorios.obterResumo(periodo).subscribe({
      next: resposta => {
        if (this.filtroAtivo() !== periodo) return;
        this.dados.set(resposta);
        this.carregando.set(false);
      },
      error: () => {
        if (this.filtroAtivo() !== periodo) return;
        this.carregando.set(false);
        this.erro.set('Não foi possível carregar os relatórios. Verifique a conexão com a API.');
      },
    });
  }

  get alturaMaxima(): number {
    return Math.max(1, ...((this.dados()?.grafico ?? []).map(item => item.valor)));
  }

  get totalNoPeriodo(): number {
    return (this.dados()?.grafico ?? []).reduce((total, item) => total + item.valor, 0);
  }
}
