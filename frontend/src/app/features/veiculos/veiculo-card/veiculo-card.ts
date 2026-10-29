
import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Veiculo } from '../veiculo.model';

@Component({
  selector: 'app-veiculo-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './veiculo-card.html',
  styleUrl: './veiculo-card.css',
})
export class VeiculoCardComponent {
  private readonly router = inject(Router);

  veiculo = input.required<Veiculo>();
  clienteNome = input('Cliente não encontrado');
  imagemComErro = signal(false);
  
  editar(): void {
    this.router.navigate([
      '/painel/veiculos/editar',
      this.veiculo()._id,
    ]);
  }
}
