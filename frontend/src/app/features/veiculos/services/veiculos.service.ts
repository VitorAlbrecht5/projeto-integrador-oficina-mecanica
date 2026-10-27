
import { Observable } from 'rxjs';
import { Veiculo, CriarVeiculoDTO } from '../veiculo.model';

export abstract class VeiculosService {
  abstract listar(): Observable<Veiculo[]>;
  abstract buscarPorId(id: string): Observable<Veiculo>;
  abstract buscarPorPlaca(placa: string): Observable<Veiculo | undefined>;
  abstract criar(veiculo: CriarVeiculoDTO): Observable<Veiculo>;
  abstract atualizar(id: string, veiculo: Partial<Veiculo>): Observable<Veiculo>;
  abstract excluir(id: string): Observable<void>;
}
