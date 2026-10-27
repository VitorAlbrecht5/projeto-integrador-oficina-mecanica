import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  OrdemServico,
  OrdemServicoInput,
  StatusOrdemServico,
} from '../ordem-servico.model';

import { OrdemServicoService } from './ordem-servico.service';

@Injectable({
  providedIn: 'root',
})
export class OrdemServicoMockService implements OrdemServicoService {
  private ordens = signal<OrdemServico[]>([
    {
      _id: '1',
      veiculoId: '1',
      clienteId: 1,
      descricaoProblema: 'Motor falhando',
      status: 'Na Fila',
      dataEntrada: '2026-10-21',
    },
    {
      _id: '2',
      veiculoId: '2',
      clienteId: 2,
      descricaoProblema: 'Troca de óleo',
      status: 'Em Conserto',
      dataEntrada: '2026-10-22',
    },
    {
      _id: '3',
      veiculoId: '3',
      clienteId: 1,
      descricaoProblema: 'Bateria descarregada',
      status: 'Pronto',
      dataEntrada: '2026-10-23',
    },
  ]);

  listar(): Observable<OrdemServico[]> {
    return of(this.ordens().map((ordem) => ({ ...ordem })));
  }

  obterPorId(id: string): Observable<OrdemServico | undefined> {
    const ordem = this.ordens().find((o) => o._id === id);

    return of(ordem ? { ...ordem } : undefined);
  }

  criar(dados: OrdemServicoInput): Observable<OrdemServico> {
    const nova: OrdemServico = {
      ...dados,
      _id: Date.now().toString(),
    };

    this.ordens.update((lista) => [...lista, nova]);

    return of({ ...nova });
  }

  atualizar(
    id: string,
    dados: Partial<OrdemServico>,
  ): Observable<OrdemServico> {
    const existente = this.ordens().find((o) => o._id === id);

    if (!existente) {
      throw new Error('Ordem de serviço não encontrada.');
    }

    const atualizada = { ...existente, ...dados };

    this.ordens.update((lista) =>
      lista.map((o) => (o._id === id ? atualizada : o)),
    );

    return of({ ...atualizada });
  }

  atualizarStatus(
    id: string,
    status: StatusOrdemServico,
  ): Observable<OrdemServico> {
    return this.atualizar(id, { status });
  }
}