
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { VeiculosService } from './veiculos.service';
import { Veiculo, CriarVeiculoDTO } from '../veiculo.model';

@Injectable({
  providedIn: 'root',
})
export class VeiculosMockService implements VeiculosService {
  private veiculos: Veiculo[] = [
    {
      _id: '1',
      placa: 'ABC-1234',
      modelo: 'Gol',
      cor: 'Branco',
      ano: 2015,
      defeitoRelatado: 'Motor falhando',
      status: 'Na Fila',
      clienteId: 1,
    },
    {
      _id: '2',
      placa: 'XYZ-9876',
      modelo: 'Civic',
      cor: 'Preto',
      ano: 2020,
      defeitoRelatado: 'Troca de óleo',
      status: 'Em Conserto',
      clienteId: 2,
    },
    {
      _id: '3',
      placa: 'DEF-5678',
      modelo: 'Onix',
      cor: 'Prata',
      ano: 2022,
      defeitoRelatado: 'Bateria descarregada',
      status: 'Pronto',
      clienteId: 1,
    },
  ];

  listar(): Observable<Veiculo[]> {
    return of([...this.veiculos]).pipe(delay(500));
  }

  buscarPorId(id: string): Observable<Veiculo> {
    const veiculo = this.veiculos.find((v) => v._id === id);

    if (!veiculo) {
      throw new Error('Veículo não encontrado');
    }

    return of({ ...veiculo }).pipe(delay(300));
  }

  criar(dto: CriarVeiculoDTO): Observable<Veiculo> {
    const novo: Veiculo = {
      ...dto,
      _id: Date.now().toString(),
      status: 'Na Fila',
    };

    this.veiculos.push(novo);
    return of({ ...novo }).pipe(delay(500));
  }

  atualizar(id: string, dados: Partial<Veiculo>): Observable<Veiculo> {
    const index = this.veiculos.findIndex((v) => v._id === id);

    if (index === -1) {
      throw new Error('Veículo não encontrado');
    }

    this.veiculos[index] = {
      ...this.veiculos[index],
      ...dados,
    };

    return of({ ...this.veiculos[index] }).pipe(delay(500));
  }

  excluir(id: string): Observable<void> {
    this.veiculos = this.veiculos.filter((v) => v._id !== id);
    return of(undefined).pipe(delay(500));
  }

  buscarPorPlaca(placa: string): Observable<Veiculo | undefined> {
    const placaNormalizada = placa.replace(/-/g, '').toUpperCase();

    const veiculo = this.veiculos.find(
      (v) => v.placa.replace(/-/g, '').toUpperCase() === placaNormalizada,
    );

    return of(veiculo ? { ...veiculo } : undefined).pipe(delay(300));
  }
}
