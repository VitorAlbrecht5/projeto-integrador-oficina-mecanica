import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespostaApi } from '../../../core/models/resposta-api';
import { OrdemServico, OrdemServicoInput, StatusOrdemServico } from '../ordem-servico.model';
import { OrdemServicoService } from './ordem-servico.service';

@Injectable({ providedIn: 'root' })
export class OrdemServicoApiService implements OrdemServicoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/ordens-servico`;

  listar(): Observable<OrdemServico[]> {
    return this.http.get<RespostaApi<OrdemServico[]>>(this.url).pipe(map(r => r.dados), catchError(this.tratarErro));
  }
  obterPorId(id: string): Observable<OrdemServico | undefined> {
    return this.http.get<RespostaApi<OrdemServico>>(`${this.url}/${id}`).pipe(map(r => r.dados), catchError(this.tratarErro));
  }
  criar(dados: OrdemServicoInput): Observable<OrdemServico> {
    return this.http.post<RespostaApi<OrdemServico>>(this.url, dados).pipe(map(r => r.dados), catchError(this.tratarErro));
  }
  atualizar(id: string, dados: Partial<OrdemServico>): Observable<OrdemServico> {
    return this.http.patch<RespostaApi<OrdemServico>>(`${this.url}/${id}`, dados).pipe(map(r => r.dados), catchError(this.tratarErro));
  }
  atualizarStatus(id: string, status: StatusOrdemServico): Observable<OrdemServico> {
    return this.atualizar(id, { status });
  }
  private tratarErro(e: HttpErrorResponse): Observable<never> {
    const resposta = e.error as { message?: string | string[] } | null;
    const mensagem = resposta?.message;
    return throwError(() => new Error((Array.isArray(mensagem) ? mensagem.join(' · ') : mensagem) || 'Erro na API de Ordens de Serviço.'));
  }
}
