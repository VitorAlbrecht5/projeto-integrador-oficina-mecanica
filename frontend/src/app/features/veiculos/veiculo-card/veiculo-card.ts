import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Veiculo } from '../veiculo.model';

@Component({
  selector: 'app-veiculo-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './veiculo-card.html',
  styleUrls: ['./veiculo-card.css']
})
export class VeiculoCardComponent {
  private readonly router = inject(Router);
  veiculo = input.required<Veiculo>();

  clicado = output<Veiculo>();

  aoClicar() {
    this.clicado.emit(this.veiculo());
  }

  editar() {
    this.router.navigate(['/painel/veiculos', this.veiculo()._id, 'editar']);
  }
}
