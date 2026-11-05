import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VeiculosService } from '../services/veiculos.service';
import { Veiculo } from '../veiculo.model';
import { VeiculoCardComponent } from '../veiculo-card/veiculo-card';
import { ClienteService } from '../../clientes/cliente.service';

@Component({
  selector: 'app-veiculos-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, VeiculoCardComponent],
  templateUrl: './veiculos-lista.html',
  styleUrls: ['./veiculos-lista.css']
})
export class VeiculosListaComponent implements OnInit {
  private veiculosService = inject(VeiculosService);
  private clienteService = inject(ClienteService);

  veiculos = signal<Veiculo[]>([]);
  carregando = signal<boolean>(true);
  erroAoCarregar = signal<string | null>(null);

  termoBusca = signal<string>('');
  filtroSituacao = signal<'ativos' | 'inativos' | 'todos'>('ativos');

  veiculosFiltrados = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    const filtro = this.filtroSituacao();

    return this.veiculos().filter((veiculo) => {
      const correspondeSituacao =
        filtro === 'todos' ||
        (filtro === 'ativos' && veiculo.ativo) ||
        (filtro === 'inativos' && !veiculo.ativo);

      const correspondeBusca =
        veiculo.placa.toLowerCase().includes(termo) ||
        veiculo.modelo.toLowerCase().includes(termo);

      return correspondeSituacao && correspondeBusca;
    });
  });


  ngOnInit() {
    this.carregarVeiculos();
  }

  carregarVeiculos() {
    this.carregando.set(true);
    this.erroAoCarregar.set(null);

    this.veiculosService.listar().subscribe({
      next: (dados) => {
        this.veiculos.set(dados);
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error('Erro', erro);
        this.erroAoCarregar.set('Não foi possível carregar a lista de veículos. Tente novamente.');
        this.carregando.set(false);
      }
    });
  }

  aoDigitarBusca(evento: any) {
    this.termoBusca.set(evento.target.value);
  }

  nomeCliente(clienteId: number): string {
    const cliente = this.clienteService
      .obterClientes()
      .find(c => c.id === clienteId);

    return cliente?.nomeCompleto ?? 'Cliente não encontrado';
  }

  alterarSituacao(veiculo: Veiculo): void {
    const ativar = !veiculo.ativo;
    const acao = ativar ? 'ativar' : 'desativar';

    const confirmou = window.confirm(
      `Deseja ${acao} o veículo ${veiculo.modelo}, placa ${veiculo.placa}?`
    );

    if (!confirmou) return;

    const operacao = ativar
      ? this.veiculosService.reativar(veiculo._id)
      : this.veiculosService.excluir(veiculo._id);

    operacao.subscribe({
      next: () => {
        alert(
          `Veículo ${ativar ? 'ativado' : 'desativado'} com sucesso!`
        );

        this.carregarVeiculos();
      },
      error: (erro) => {
        console.error('Erro ao alterar situação do veículo:', erro);

        alert(
          erro instanceof Error
            ? erro.message
            : 'Não foi possível alterar a situação do veículo.'
        );
      },
    });
  }

}

