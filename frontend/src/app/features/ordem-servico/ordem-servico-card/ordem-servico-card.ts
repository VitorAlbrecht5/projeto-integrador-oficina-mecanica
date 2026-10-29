import { Component, input, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrdemServicoExibicao } from './ordem-servico.model';

@Component({
  selector: 'app-ordem-servico-card',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './ordem-servico-card.html',
  styleUrls: ['./ordem-servico-card.css']
})
export class OrdemServicoCard {
  os = input.required<OrdemServicoExibicao>();
  private router = inject(Router);

  abrirEdicao() {
    const id = this.os()._id;
    this.router.navigate(['/ordem-servico/editar', id]);
  }
}