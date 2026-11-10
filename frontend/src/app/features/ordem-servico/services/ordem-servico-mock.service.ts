import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { OrdemServico, OrdemServicoInput, StatusOrdemServico } from '../ordem-servico.model';
import { OrdemServicoService } from './ordem-servico.service';
@Injectable({ providedIn: 'root' })
export class OrdemServicoMockService implements OrdemServicoService {
  private ordens: OrdemServico[] = [];
  listar(): Observable<OrdemServico[]> { return of([...this.ordens]); }
  obterPorId(id: string): Observable<OrdemServico | undefined> { return of(this.ordens.find(o => o._id === id)); }
  criar(d: OrdemServicoInput): Observable<OrdemServico> {
    const o: OrdemServico = { ...d, _id: Date.now().toString(), clienteId: '',
      status: 'Na Fila', dataEntrada: new Date().toISOString() };
    this.ordens.push(o); return of(o);
  }
  atualizar(id: string, d: Partial<OrdemServico>): Observable<OrdemServico> {
    const o = this.ordens.find(x => x._id === id);
    if (!o) return throwError(() => new Error('OS não encontrada.'));
    Object.assign(o, d); return of(o);
  }
  atualizarStatus(id: string, status: StatusOrdemServico): Observable<OrdemServico> {
    return this.atualizar(id, { status });
  }
}
