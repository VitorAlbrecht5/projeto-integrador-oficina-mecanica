import { Observable } from 'rxjs';
import { OrdemServico, OrdemServicoInput, StatusOrdemServico } from '../ordem-servico.model';

export abstract class OrdemServicoService {
  abstract listar(): Observable<OrdemServico[]>;
  abstract obterPorId(id: string): Observable<OrdemServico | undefined>;
  abstract criar(dados: OrdemServicoInput): Observable<OrdemServico>;
  abstract atualizar(id: string, dados: Partial<OrdemServico>): Observable<OrdemServico>;
  abstract atualizarStatus(id: string, status: StatusOrdemServico): Observable<OrdemServico>;
}