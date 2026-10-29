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

  veiculosFiltrados = computed(() => {
    const lista = this.veiculos();
    const termo = this.termoBusca().toLowerCase();
    return lista.filter(v => 
      v.placa.toLowerCase().includes(termo) ||
      v.modelo.toLowerCase().includes(termo)
    );
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
}

