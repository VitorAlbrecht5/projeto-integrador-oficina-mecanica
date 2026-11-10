import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RespostaApi } from '../../core/models/resposta-api';

interface StatusPublico {
  placa: string;
  modelo: string;
  imagemUrl?: string;
  status: 'Na Fila' | 'Em Conserto' | 'Aguardando Peça' | 'Pronto';
  observacao?: string;
  servicos: { nome: string; preco: number }[];
  totalEstimado: number;
}

@Component({
  selector: 'app-pagina-publica',
  standalone: true,
  imports: [FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './pagina-publica.html',
  styleUrl: './pagina-publica.css',
})
export class PaginaPublica {
  private readonly http = inject(HttpClient);
  placa = '';
  placaPesquisada = '';
  pesquisado = false;
  carregando = false;
  veiculo: StatusPublico | null = null;
  erro = '';

  pesquisar() {
    const placa = this.placa.trim().replace(/-/g, '').toUpperCase();
    this.placaPesquisada = placa;
    this.pesquisado = false;
    this.veiculo = null;
    this.erro = '';

    if (!/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(placa)) {
      this.erro = 'Informe uma placa válida, como ABC1234 ou ABC1D23.';
      this.pesquisado = true;
      return;
    }

    this.carregando = true;
    this.http.get<RespostaApi<StatusPublico>>(
      `${environment.apiUrl}/veiculos/consulta/${encodeURIComponent(placa)}`,
    ).subscribe({
      next: resposta => {
        this.veiculo = resposta.dados;
        this.pesquisado = true;
        this.carregando = false;
      },
      error: (erro: HttpErrorResponse) => {
        this.erro = erro.status === 404
          ? 'Não encontramos um veículo ativo com essa placa.'
          : 'Não foi possível consultar o veículo. Tente novamente.';
        this.pesquisado = true;
        this.carregando = false;
      },
    });
  }
}
