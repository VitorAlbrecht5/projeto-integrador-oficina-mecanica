import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RespostaApi } from '../../core/models/resposta-api';
import { Servico, ServicoEntrada } from './servicos.model';

@Injectable({ providedIn: 'root' })
export class ServicosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/servicos`;

  obterServicos(): Observable<Servico[]> {
    return this.http.get<RespostaApi<Servico[]>>(this.url).pipe(
      map(r => r.dados), catchError(this.tratarErro),
    );
  }
  adicionarServico(dados: ServicoEntrada): Observable<Servico> {
    return this.http.post<RespostaApi<Servico>>(this.url, dados).pipe(
      map(r => r.dados), catchError(this.tratarErro),
    );
  }
  atualizarServico(id: string, dados: ServicoEntrada): Observable<Servico> {
    return this.http.put<RespostaApi<Servico>>(`${this.url}/${id}`, dados).pipe(
      map(r => r.dados), catchError(this.tratarErro),
    );
  }
  excluirServico(id: string): Observable<void> {
    return this.http.delete<RespostaApi<unknown>>(`${this.url}/${id}`).pipe(
      map(() => undefined), catchError(this.tratarErro),
    );
  }
  private tratarErro(e: HttpErrorResponse): Observable<never> {
    const corpo = e.error as { message?: string | string[] } | null;
    const msg = corpo?.message;
    return throwError(() => new Error(
      (Array.isArray(msg) ? msg.join(' · ') : msg) || 'Erro ao comunicar com a API de Serviços.',
    ));
  }
}
