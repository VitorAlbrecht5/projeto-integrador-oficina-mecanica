import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';

import { OrdemServicoService } from '../services/ordem-servico.service';
import {
  OrdemServicoExibicao,
  StatusOrdemServico,
} from '../ordem-servico-card/ordem-servico.model';

import { OrdemServicoCard } from '../ordem-servico-card/ordem-servico-card';
import { VeiculosService } from '../../veiculos/services/veiculos.service';
import { ClienteService } from '../../clientes/cliente.service';

@Component({
  selector: 'app-ordem-servico-lista',
  standalone: true,
  imports: [CommonModule, RouterLink, OrdemServicoCard],
  templateUrl: './ordem-servico-lista.html',
  styleUrl: './ordem-servico-lista.css',
})
export class OrdemServicoLista implements OnInit {
  private service = inject(OrdemServicoService);
  private veiculosService = inject(VeiculosService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);

  ordens = signal<OrdemServicoExibicao[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);

  get totalRecebidos(): number {
    return this.ordens().filter(
      (os) => os.status === 'Veículo recebido - Aguardando Avaliação'
    ).length;
  }

  get totalEmManutencao(): number {
    return this.ordens().filter(
      (os) => os.status === 'Em manutenção'
    ).length;
  }

  get totalAguardandoPecas(): number {
    return this.ordens().filter(
      (os) => os.status === 'Aguardando Peças'
    ).length;
  }

  get totalProntos(): number {
    return this.ordens().filter(
      (os) => os.status === 'Pronto para retirada'
    ).length;
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

  abrirFormularioEdicao(os: OrdemServicoExibicao): void {
    // Redireciona para a rota de edição passando o ID da ordem de serviço
    this.router.navigate(['/painel/ordem-servico/editar', os._id]);
  }
}