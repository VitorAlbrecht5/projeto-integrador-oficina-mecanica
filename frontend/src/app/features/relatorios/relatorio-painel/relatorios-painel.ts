import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-relatorio-painel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatorios-painel.html',
  styleUrls: ['./relatorios-painel.css']
})
export class RelatorioPainel {
  filtroAtivo = signal<'dia' | 'mes' | 'ano'>('mes');

  dadosGrafico = {
    dia: [
      { label: 'Seg', valor: 2 },
      { label: 'Ter', valor: 4 },
      { label: 'Qua', valor: 3 },
      { label: 'Qui', valor: 5 },
      { label: 'Sex', valor: 1 }
    ],
    mes: [
      { label: 'Semana 1', valor: 3 },
      { label: 'Semana 2', valor: 4 },
      { label: 'Semana 3', valor: 2 },
      { label: 'Semana 4', valor: 3 }
    ],
    ano: [
      { label: 'Jan', valor: 10 },
      { label: 'Fev', valor: 12 },
      { label: 'Mar', valor: 15 },
      { label: 'Abr', valor: 14 }
    ]
  };

  alterarFiltro(periodo: 'dia' | 'mes' | 'ano') {
    this.filtroAtivo.set(periodo);
  }

  obterTotalConsertados(): number {
    return this.dadosGrafico[this.filtroAtivo()].reduce((acc, item) => acc + item.valor, 0);
  }
}