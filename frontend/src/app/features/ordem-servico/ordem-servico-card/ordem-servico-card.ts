import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrdemServicoExibicao } from '../ordem-servico.model';

@Component({
  selector: 'app-ordem-servico-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordem-servico-card.html',
  styleUrl: './ordem-servico-card.css',
})
export class OrdemServicoCard {
  private readonly router = inject(Router);
  os = input.required<OrdemServicoExibicao>();
  imagemComErro = false;

  editar(): void {
    this.router.navigate(['/painel/ordem-servico/editar', this.os()._id]);
  }
}
