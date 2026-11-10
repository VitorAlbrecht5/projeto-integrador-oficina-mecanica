import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClienteService } from '../cliente.service';
import { Cliente } from '../cliente.model';

@Component({
  selector: 'app-cliente-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cliente-lista.html',
  styleUrls: ['./cliente-lista.css'],
})
export class ClienteLista implements OnInit {
  private readonly clienteService = inject(ClienteService);
  readonly clientes = signal<Cliente[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando.set(true);
    this.erro.set(null);
    this.clienteService.carregarClientes().subscribe({
      next: lista => { this.clientes.set(lista); this.carregando.set(false); },
      error: (erro: Error) => { this.erro.set(erro.message); this.carregando.set(false); },
    });
  }

  deletar(id: string) {
    if (!confirm('Deseja desativar este cliente?')) return;
    this.clienteService.excluirCliente(id).subscribe({
      next: () => this.carregar(),
      error: (erro: Error) => this.erro.set(erro.message),
    });
  }
}
