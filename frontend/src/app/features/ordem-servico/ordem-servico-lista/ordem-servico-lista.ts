import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';

import { OrdemServicoService } from '../services/ordem-servico.service';
import {
  OrdemServicoExibicao,
  StatusOrdemServico,
} from '../ordem-servico.model';

import { OrdemServicoCard } from '../ordem-servico-card/ordem-servico-card';
import { VeiculosService } from '../../veiculos/services/veiculos.service';
import { ClienteService } from '../../clientes/cliente.service';

@Component({
  selector: 'app-ordem-servico-lista',
  standalone: true,
  imports: [CommonModule, OrdemServicoCard],
  templateUrl: './ordem-servico-lista.html',
  styleUrl: './ordem-servico-lista.css',
})
export class OrdemServicoLista implements OnInit {
  private service = inject(OrdemServicoService);
  private veiculosService = inject(VeiculosService);
  private clienteService = inject(ClienteService);

  ordens = signal<OrdemServicoExibicao[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);
  get totalNaFila(): number {
    return this.ordens().filter(os => os.status === 'Na Fila').length;
  }

  get totalEmConserto(): number {
    return this.ordens().filter(os => os.status === 'Em Conserto').length;
  }

  get totalProntos(): number {
    return this.ordens().filter(os => os.status === 'Pronto').length;
  }

  ngOnInit(): void {
    this.carregarOrdens();
  }

  carregarOrdens(): void {
    this.carregando.set(true);
    this.erro.set(null);

    combineLatest([
      this.service.listar(),
      this.veiculosService.listar(),
    ]).subscribe({
      next: ([ordens, veiculos]) => {
        const clientes = this.clienteService.obterClientes();

        const ordensExibicao: OrdemServicoExibicao[] = ordens.map((ordem) => {
          const veiculo = veiculos.find(
            (v) => v._id === ordem.veiculoId,
          );

          const cliente = clientes.find(
            (c) => c.id === ordem.clienteId,
          );

          return {
            ...ordem,
            veiculo: veiculo?.modelo ?? 'Veículo não encontrado',
            placa: veiculo?.placa ?? 'Sem placa',
            cliente: cliente?.nomeCompleto ?? 'Cliente não encontrado',
          };
        });

        this.ordens.set(ordensExibicao);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar as ordens de serviço.');
        this.carregando.set(false);
      },
    });
  }

  onMudarStatus(id: string, novoStatus: StatusOrdemServico): void {
    this.service.atualizarStatus(id, novoStatus).subscribe({
      next: () => this.carregarOrdens(),
      error: () => this.erro.set('Não foi possível atualizar o status.'),
    });
  }
}