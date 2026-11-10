import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { OrdemServicoService } from '../services/ordem-servico.service';
import { OrdemServicoExibicao } from '../ordem-servico.model';
import { OrdemServicoCard } from '../ordem-servico-card/ordem-servico-card';
import { VeiculosService } from '../../veiculos/services/veiculos.service';
import { Veiculo } from '../../veiculos/veiculo.model';
import { ClienteService } from '../../clientes/cliente.service';

@Component({
  selector: 'app-ordem-servico-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, OrdemServicoCard],
  templateUrl: './ordem-servico-lista.html',
  styleUrl: './ordem-servico-lista.css',
})
export class OrdemServicoLista implements OnInit {
  private readonly router = inject(Router);
  private readonly service = inject(OrdemServicoService);
  private readonly veiculosService = inject(VeiculosService);
  private readonly clienteService = inject(ClienteService);
  ordens = signal<OrdemServicoExibicao[]>([]);
  semOrdem = signal<Veiculo[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);
  veiculoEscolhido = '';
  busca = '';
  filtro = 'todos';
  readonly limiteEmAndamento = signal(6);
  readonly limiteHistorico = signal(6);

  get emAndamentoVisiveis(): OrdemServicoExibicao[] { return this.emAndamento.slice(0, this.limiteEmAndamento()); }
  get historicoVisivel(): OrdemServicoExibicao[] { return this.historico.slice(0, this.limiteHistorico()); }
  carregarMaisEmAndamento(): void { this.limiteEmAndamento.update(qtd => qtd + 6); }
  carregarMaisHistorico(): void { this.limiteHistorico.update(qtd => qtd + 6); }
  mudarBusca(texto: string): void { this.busca = texto; this.reiniciarPaginacao(); }
  mudarFiltro(status: string): void { this.filtro = status; this.reiniciarPaginacao(); }
  private reiniciarPaginacao(): void { this.limiteEmAndamento.set(6); this.limiteHistorico.set(6); }


  get emAndamento(): OrdemServicoExibicao[] { return this.filtrar(this.ordens().filter(o => o.status !== 'Pronto')); }
  get historico(): OrdemServicoExibicao[] { return this.filtrar(this.ordens().filter(o => o.status === 'Pronto')); }
  get totalEmAndamento(): number { return this.ordens().filter(o => o.status !== 'Pronto').length; }
  private filtrar(itens: OrdemServicoExibicao[]): OrdemServicoExibicao[] {
    const q = this.busca.trim().toLowerCase();
    return itens.filter(o =>
      (this.filtro === 'todos' || o.status === this.filtro) &&
      (!q || [o.veiculo, o.placa, o.cliente, o.descricaoProblema].some(valor => valor.toLowerCase().includes(q)))
    );
  }
  abrirOS(): void {
    if (this.veiculoEscolhido) {
      this.router.navigate(['/painel/ordem-servico/nova', this.veiculoEscolhido]);
    }
  }


  get totalAguardandoAvaliacao(): number { return this.ordens().filter(o => o.status === 'Na Fila').length; }
  get totalEmManutencao(): number { return this.ordens().filter(o => o.status === 'Em Conserto').length; }
  get totalAguardandoPecas(): number { return this.ordens().filter(o => o.status === 'Aguardando Peça').length; }
  get totalProntos(): number { return this.ordens().filter(o => o.status === 'Pronto').length; }

  ngOnInit(): void { this.carregarOrdens(); }
  carregarOrdens(): void {
    this.carregando.set(true); this.erro.set(null); this.reiniciarPaginacao();
    forkJoin({
      ordens: this.service.listar(),
      veiculos: this.veiculosService.listar(),
      clientes: this.clienteService.carregarClientes(),
    }).subscribe({
      next: ({ ordens, veiculos, clientes }) => {
        const ativos = veiculos.filter(v => v.ativo);
        const mapaVeiculos = new Map(veiculos.map(v => [v._id, v]));
        const mapaClientes = new Map(clientes.map(c => [c._id, c]));
        this.semOrdem.set(ativos.filter(v => !ordens.some(o => o.veiculoId === v._id && o.status !== 'Pronto')));
        if (!this.semOrdem().some(v => v._id === this.veiculoEscolhido)) this.veiculoEscolhido = ''; 
        this.ordens.set(ordens.flatMap(ordem => {
          const veiculo = mapaVeiculos.get(ordem.veiculoId);
          if (!veiculo) return [];
          return [{
            ...ordem,
            veiculo: veiculo.modelo,
            placa: veiculo.placa,
            cliente: mapaClientes.get(ordem.clienteId)?.nomeCompleto ?? 'Cliente não encontrado',
            ano: veiculo.ano,
            cor: veiculo.cor,
            imagemUrl: veiculo.imagemUrl,
          }];
        }));
        this.carregando.set(false);
      },
      error: (e: Error) => { this.erro.set(e.message || 'Erro ao carregar ordens.'); this.carregando.set(false); },
    });
  }
}
