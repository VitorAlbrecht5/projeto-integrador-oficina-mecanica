import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VeiculosService } from '../services/veiculos.service';
import { Veiculo } from '../veiculo.model';
import { VeiculoCardComponent } from '../veiculo-card/veiculo-card';
import { ClienteService } from '../../clientes/cliente.service';
import { Cliente } from '../../clientes/cliente.model';

@Component({
  selector: 'app-veiculos-lista', standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, VeiculoCardComponent],
  templateUrl: './veiculos-lista.html', styleUrls: ['./veiculos-lista.css'],
})
export class VeiculosListaComponent implements OnInit {
  private readonly veiculosService = inject(VeiculosService);
  private readonly clienteService = inject(ClienteService);
  readonly veiculos = signal<Veiculo[]>([]);
  readonly clientes = signal<Cliente[]>([]);
  readonly carregando = signal(true);
  readonly erroAoCarregar = signal<string | null>(null);
  readonly termoBusca = signal('');
  readonly filtroSituacao = signal<'ativos' | 'inativos' | 'todos'>('ativos');
  readonly quantidadeVisivel = signal(9);

  readonly veiculosFiltrados = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    const filtro = this.filtroSituacao();
    return this.veiculos().filter(veiculo => {
      const correspondeSituacao = filtro === 'todos' ||
        (filtro === 'ativos' && veiculo.ativo) ||
        (filtro === 'inativos' && !veiculo.ativo);
      const correspondeBusca = veiculo.placa.toLowerCase().includes(termo) ||
        veiculo.modelo.toLowerCase().includes(termo);
      return correspondeSituacao && correspondeBusca;
    });
  });

  readonly veiculosVisiveis = computed(() =>
    this.veiculosFiltrados().slice(0, this.quantidadeVisivel())
  );

  carregarMais(): void {
    this.quantidadeVisivel.update(qtd => qtd + 9);
  }

  alterarFiltroSituacao(valor: 'ativos' | 'inativos' | 'todos'): void {
    this.filtroSituacao.set(valor);
    this.quantidadeVisivel.set(9);
  }

  ngOnInit() {
    this.carregarVeiculos();
    this.clienteService.carregarClientes().subscribe({
      next: clientes => this.clientes.set(clientes),
      error: () => this.erroAoCarregar.set('Não foi possível consultar os clientes vinculados.'),
    });
  }

  carregarVeiculos() {
    this.carregando.set(true);
    this.erroAoCarregar.set(null);
    this.quantidadeVisivel.set(9);
    this.veiculosService.listar().subscribe({
      next: veiculos => { this.veiculos.set(veiculos); this.carregando.set(false); },
      error: (erro: Error) => { this.erroAoCarregar.set(erro.message); this.carregando.set(false); },
    });
  }

  aoDigitarBusca(evento: Event) {
    this.termoBusca.set((evento.target as HTMLInputElement).value);
    this.quantidadeVisivel.set(9);
  }

  nomeCliente(id: string) {
    return this.clientes().find(cliente => cliente._id === id)?.nomeCompleto ?? 'Cliente indisponível';
  }

  alterarSituacao(veiculo: Veiculo) {
    const ativar = !veiculo.ativo;
    if (!window.confirm(`Deseja ${ativar ? 'ativar' : 'desativar'} o veículo ${veiculo.modelo}, placa ${veiculo.placa}?`)) return;
    const requisicao = ativar
      ? this.veiculosService.reativar(veiculo._id)
      : this.veiculosService.excluir(veiculo._id);
    requisicao.subscribe({
      next: () => { this.carregarVeiculos(); },
      error: (erro: Error) => window.alert(erro.message),
    });
  }
}
