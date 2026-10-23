import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdemServico, StatusOrdemServico } from '../ordem-servico.model';

@Component({
  selector: 'app-ordem-servico-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-os">
      <div class="card-header">
        <h3>{{ os().veiculo }}</h3>
        <span class="badge" [ngClass]="obterClasseStatus(os().status)">{{ os().status }}</span>
      </div>
      <div class="card-body">
        <p><strong>Placa:</strong> {{ os().placa }}</p>
        <p><strong>Cliente:</strong> {{ os().cliente }}</p>
      </div>
      <div class="card-actions">
        @if (os().status === 'Na Fila') {
          <button class="btn-acao" (click)="mudarStatus('Em Conserto')">Iniciar Conserto</button>
        }
        @if (os().status === 'Em Conserto') {
          <button class="btn-acao btn-sucesso" (click)="mudarStatus('Pronto')">Marcar como Pronto</button>
        }
      </div>
    </div>
  `,
  styles: [`
    .card-os { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
    .badge.na-fila { background: #fef3c7; color: #92400e; }
    .badge.em-conserto { background: #dbeafe; color: #1e40af; }
    .badge.pronto { background: #dcfce7; color: #166534; }
    .btn-acao { padding: 6px 12px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .btn-sucesso { background: #16a34a; }
  `]
})
export class OrdemServicoCardComponent {
  os = input.required<OrdemServico>();
  statusChange = output<{ id: string | number; novoStatus: StatusOrdemServico }>();

  mudarStatus(novoStatus: StatusOrdemServico) {
    const identificador = this.os()._id ?? this.os().id ?? 0;
    this.statusChange.emit({ id: identificador, novoStatus });
  }

  obterClasseStatus(status: StatusOrdemServico): string {
    switch (status) {
      case 'Na Fila': return 'na-fila';
      case 'Em Conserto': return 'em-conserto';
      case 'Pronto': return 'pronto';
      default: return '';
    }
  }
}