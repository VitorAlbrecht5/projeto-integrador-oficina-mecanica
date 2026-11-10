import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RespostaApi } from '../../core/models/resposta-api';
import { PeriodoRelatorio, RelatorioOficina } from './relatorios.model';

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  private readonly http = inject(HttpClient);

  obterResumo(periodo: PeriodoRelatorio): Observable<RelatorioOficina> {
    return this.http.get<RespostaApi<RelatorioOficina>>(
      `${environment.apiUrl}/relatorios/resumo`, { params: { periodo } },
    ).pipe(map(resposta => resposta.dados));
  }
}
