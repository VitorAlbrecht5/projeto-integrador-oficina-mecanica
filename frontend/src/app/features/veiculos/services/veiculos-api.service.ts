import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespostaApi } from '../../../core/models/resposta-api';
import { Veiculo, CriarVeiculoDTO } from '../veiculo.model';
import { VeiculosService } from './veiculos.service';

@Injectable({ providedIn: 'root' })
export class VeiculosApiService implements VeiculosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/veiculos`;

  listar(): Observable<Veiculo[]> {
    return this.http.get<RespostaApi<Veiculo[]>>(this.url).pipe(
      map(resposta => resposta.dados), catchError(this.tratarErro),
    );
  }

  buscarPorId(id: string): Observable<Veiculo> {
    return this.http.get<RespostaApi<Veiculo>>(`${this.url}/${id}`).pipe(
      map(resposta => resposta.dados), catchError(this.tratarErro),
    );
  }

  buscarPorPlaca(placa: string): Observable<Veiculo | undefined> {
    const normalizada = placa.replace(/-/g, '').trim().toUpperCase();
    return this.http.get<RespostaApi<Veiculo[]>>(this.url, {
      params: { placa: normalizada },
    }).pipe(
      map(resposta => resposta.dados.find(veiculo => veiculo.placa === normalizada)),
      catchError(this.tratarErro),
    );
  }

  criar(veiculo: CriarVeiculoDTO): Observable<Veiculo> {
    return this.http.post<RespostaApi<Veiculo>>(this.url, veiculo).pipe(
      map(resposta => resposta.dados), catchError(this.tratarErro),
    );
  }

  atualizar(id: string, veiculo: Partial<Veiculo>): Observable<Veiculo> {
    return this.http.patch<RespostaApi<Veiculo>>(`${this.url}/${id}`, veiculo).pipe(
      map(resposta => resposta.dados), catchError(this.tratarErro),
    );
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<RespostaApi<{ mensagem: string }>>(`${this.url}/${id}`).pipe(
      map(() => undefined), catchError(this.tratarErro),
    );
  }

  reativar(id: string): Observable<void> {
    return this.http.patch<RespostaApi<{ mensagem: string }>>(`${this.url}/${id}/reativar`, {}).pipe(
      map(() => undefined), catchError(this.tratarErro),
    );
  }

  private tratarErro(erro: HttpErrorResponse): Observable<never> {
    const resposta = erro.error as { message?: string | string[] } | null;
    const mensagem = resposta?.message;
    return throwError(() => new Error(
      (Array.isArray(mensagem) ? mensagem.join(' · ') : mensagem) ||
      'Não foi possível comunicar com o servidor.',
    ));
  }
}
