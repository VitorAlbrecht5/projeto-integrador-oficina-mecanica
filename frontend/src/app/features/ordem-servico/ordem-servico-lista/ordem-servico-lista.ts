import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { combineLatest, forkJoin } from 'rxjs';

import { OrdemServicoService } from '../services/ordem-servico.service';
import { OrdemServicoExibicao, StatusOrdemServico } from '../ordem-servico.model';
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

  ordens = signal<OrdemServicoExibicao[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);

  get totalAguardandoAvaliacao(): number {
    return this.ordens().filter(os => os.status === 'Veículo recebido - Aguardando Avaliação').length;
  }
  get totalEmManutencao(): number {
    return this.ordens().filter(os => os.status === 'Em manutenção').length;
  }
  get totalAguardandoPecas(): number {
    return this.ordens().filter(os => os.status === 'Aguardando Peças').length;
  }
  get totalProntos(): number {
    return this.ordens().filter(os => os.status === 'Pronto para retirada').length;
  }

  ngOnInit(): void { this.carregarOrdens(); }

  carregarOrdens(): void {
    this.carregando.set(true);
    this.erro.set(null);
    combineLatest([this.service.listar(), this.veiculosService.listar()]).subscribe({
      next: ([ordens, veiculos]) => {
        const clientes = this.clienteService.obterClientes();
        const ativos = veiculos.filter(v => v.ativo);
        const veiculosSemOrdem = ativos.filter(v => !ordens.some(o => o.veiculoId === v._id));

        // Garante uma ordem para cada veículo ativo já cadastrado no mock.
        if (veiculosSemOrdem.length > 0) {
          forkJoin(veiculosSemOrdem.map(veiculo => this.service.criar({
            veiculoId: veiculo._id,
            clienteId: veiculo.clienteId,
            descricaoProblema: veiculo.defeitoRelatado,
            status: veiculo.status as StatusOrdemServico,
            dataEntrada: new Date().toISOString().slice(0, 10),
            servicosIds: [],
          }))).subscribe({
            next: () => this.carregarOrdens(),
            error: () => {
              this.erro.set('Não foi possível criar as ordens dos veículos cadastrados.');
              this.carregando.set(false);
            },
          });
          return;
        }

        const exibicao: OrdemServicoExibicao[] = ativos.map(veiculo => {
          const ordem = ordens.find(o => o.veiculoId === veiculo._id);
          const cliente = clientes.find(c => c.id === (ordem?.clienteId ?? veiculo.clienteId));
          return {
            ...(ordem ?? {
              _id: `sem-os-${veiculo._id}`,
              veiculoId: veiculo._id,
              clienteId: veiculo.clienteId,
              descricaoProblema: veiculo.defeitoRelatado,
              status: veiculo.status as StatusOrdemServico,
              dataEntrada: new Date().toISOString().slice(0, 10),
              servicosIds: [],
            }),
            veiculo: veiculo.modelo,
            placa: veiculo.placa,
            cliente: cliente?.nomeCompleto ?? 'Cliente não encontrado',
            ano: veiculo.ano,
            cor: veiculo.cor,
            imagemUrl: veiculo.imagemUrl,
          };
        });
        this.ordens.set(exibicao);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar as ordens de serviço.');
        this.carregando.set(false);
      },
    });
  }
}
