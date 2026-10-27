
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VeiculosService } from '../veiculos/services/veiculos.service';
import { Veiculo } from '../veiculos/veiculo.model';

@Component({
  selector: 'app-pagina-publica',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './pagina-publica.html',
  styleUrl: './pagina-publica.css',
})
export class PaginaPublica {
  private veiculosService = inject(VeiculosService);

  placa = '';
  placaPesquisada = '';
  pesquisado = false;
  carregando = false;
  veiculo: Veiculo | null = null;
  erro = '';

  pesquisar(): void {
    this.placaPesquisada = this.placa.trim().toUpperCase();
    this.pesquisado = true;
    this.carregando = true;
    this.veiculo = null;
    this.erro = '';

    this.veiculosService.listar().subscribe({
      next: (veiculos) => {
        const placaNormalizada = this.placaPesquisada.replace(/-/g, '');

        this.veiculo = veiculos.find(
          v => v.placa.replace(/-/g, '').toUpperCase() === placaNormalizada
        ) ?? null;

        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível consultar o veículo. Tente novamente.';
        this.carregando = false;
      }
    });
  }
}
