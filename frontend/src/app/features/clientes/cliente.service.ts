import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RespostaApi } from '../../core/models/resposta-api';
import { Cliente, ClienteEntrada } from './cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/clientes`;
  private readonly cache = signal<Cliente[]>([]);

  // Compatibilidade temporária com os componentes de Veículos/OS que usam cache síncrono.
  obterClientes(): Cliente[] { return this.cache(); }

  carregarClientes(): Observable<Cliente[]> {
    return this.http.get<RespostaApi<Cliente[]>>(this.url).pipe(
      map(resposta => resposta.dados),
      tap(lista => this.cache.set(lista)),
      catchError(this.tratarErro),
    );
  }

  buscarPorId(id: string): Observable<Cliente> {
    return this.http.get<RespostaApi<Cliente>>(`${this.url}/${id}`).pipe(
      map(resposta => resposta.dados),
      catchError(this.tratarErro),
    );
  }

  adicionarCliente(dados: ClienteEntrada): Observable<Cliente> {
    return this.http.post<RespostaApi<Cliente>>(this.url, dados).pipe(
      map(resposta => resposta.dados),
      tap(cliente => this.cache.update(lista => [...lista, cliente])),
      catchError(this.tratarErro),
    );
  }

  atualizarCliente(id: string, dados: Partial<ClienteEntrada>): Observable<Cliente> {
    return this.http.patch<RespostaApi<Cliente>>(`${this.url}/${id}`, dados).pipe(
      map(resposta => resposta.dados),
      tap(cliente => this.cache.update(lista =>
        lista.map(item => item._id === id ? cliente : item),
      )),
      catchError(this.tratarErro),
    );
  }

  excluirCliente(id: string): Observable<void> {
    return this.http.delete<RespostaApi<{ mensagem: string }>>(`${this.url}/${id}`).pipe(
      tap(() => this.cache.update(lista => lista.filter(item => item._id !== id))),
      map(() => undefined),
      catchError(this.tratarErro),
    );
  }

  private tratarErro(erro: HttpErrorResponse): Observable<never> {
    const resposta = erro.error as { message?: string | string[] } | null;
    const msg = resposta?.message;
    const mensagem = Array.isArray(msg) ? msg.join(' · ') : msg;
    return throwError(() => new Error(mensagem || 'Não foi possível comunicar com o servidor.'));
  }
}
