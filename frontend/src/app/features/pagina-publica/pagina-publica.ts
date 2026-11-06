
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
    imagemComErro = false;

  readonly etapas = [
    { titulo: 'Veículo recebido', descricao: 'Entrada na oficina.' },
    { titulo: 'Avaliação', descricao: 'Aguardando avaliação inicial.' },
    { titulo: 'Em manutenção', descricao: 'Serviços em execução.' },
    { titulo: 'Pronto para retirada', descricao: 'Serviços concluídos.' },
  ];

  get etapaAtual(): number {
    const status = (this.veiculo?.status ?? '').trim().toLowerCase();
    const mapa: Record<string, number> = {
      'veículo recebido - aguardando avaliação': 1,
      'na fila': 1,
      'em manutenção': 2,
      'em conserto': 2,
      'aguardando peças': 2,
      'aguardando peça': 2,
      'pronto para retirada': 3,
      'pronto': 3,
    };

    return mapa[status] ?? -1;
  }

  get aguardandoPecas(): boolean {
    const status = (this.veiculo?.status ?? '').trim().toLowerCase();
    return status === 'aguardando peças' || status === 'aguardando peça';
  }


   pesquisar(): void {
    if (this.carregando) return;

    const placa = this.placa.trim().replace(/-/g, '').toUpperCase();
    this.placa = placa;
    this.placaPesquisada = placa;
    this.pesquisado = false;
    this.veiculo = null;
    this.erro = '';
    this.imagemComErro = false;

    if (!placa) {
      this.erro = 'Digite a placa para consultar.';
      return;
    }

    if (!/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(placa)) {
      this.erro = 'Informe uma placa válida: ABC1234 ou ABC1D23.';
      return;
    }

    this.carregando = true;

    this.veiculosService.buscarPorPlaca(placa).subscribe({
      next: (veiculo: Veiculo | undefined) => {
        this.veiculo = veiculo?.ativo ? veiculo : null;
        this.pesquisado = true;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível consultar. Tente novamente.';
        this.carregando = false;
        this.pesquisado = false;
      },
    });
  }
}