import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  OrdemServicoExibicao,
  StatusOrdemServico,
} from '../ordem-servico.model';

@Component({
  selector: 'app-ordem-servico-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordem-servico-card.html',
  styleUrl: './ordem-servico-card.css',
})
export class OrdemServicoCard {
  os = input.required<OrdemServicoExibicao>();
  mudarStatus = output<StatusOrdemServico>();

  alterar(status: StatusOrdemServico): void {
    this.mudarStatus.emit(status);
  }
}