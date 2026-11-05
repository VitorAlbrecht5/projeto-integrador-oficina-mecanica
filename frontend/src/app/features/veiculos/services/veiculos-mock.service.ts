
import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { VeiculosService } from './veiculos.service';
import { Veiculo, CriarVeiculoDTO } from '../veiculo.model';

@Injectable({
  providedIn: 'root',
})
export class VeiculosMockService implements VeiculosService {
  private veiculos: Veiculo[] = [
    {
      _id: '1',
      placa: 'ABC1234',
      modelo: 'Gol',
      cor: 'Branco',
      ano: 2015,
      defeitoRelatado: 'Motor falhando',
      status: 'Veículo recebido - Aguardando Avaliação',
      clienteId: 1,
      ativo: true,
    },
    {
      _id: '2',
      placa: 'XYZ9876',
      modelo: 'Civic',
      cor: 'Preto',
      ano: 2020,
      defeitoRelatado: 'Troca de óleo',
      status: 'Em manutenção',
      clienteId: 2,
      imagemUrl: 'https://i.imgur.com/n9PA1de.jpeg',
      ativo: true
    },
    {
      _id: '3',
      placa: 'DEFF5678',
      modelo: 'Onix',
      cor: 'Prata',
      ano: 2022,
      defeitoRelatado: 'Bateria descarregada',
      status: 'Pronto para retirada',
      clienteId: 1,
      imagemUrl: 'https://i.em.com.br/NYlDQXo5HRAjM3DjTpY7wQZBLL8=/790x/smart/imgsapp.em.com.br/app/noticia_127983242361/2021/04/17/1257870/20210416191605965912u.jpg',
      ativo: true
    },
    {
      _id: '4',
      placa: 'GHI1234',
      modelo: 'Ford Escort Hobby',
      cor: 'Vermelho',
      ano: 1995,
      defeitoRelatado: 'Revisão do sistema de freios',
      status: 'Veículo recebido - Aguardando Avaliação',
      clienteId: 3,
      imagemUrl: 'https://i.imgur.com/NXcqoGC.jpeg',
      ativo: true
    },
    {
      _id: '5',
      placa: 'JKL5678',
      modelo: 'Toyota Corolla',
      cor: 'Cinza',
      ano: 2023,
      defeitoRelatado: 'Manutenção preventiva',
      status: 'Em manutenção',
      clienteId: 4,
      imagemUrl: 'https://i.imgur.com/SBDVqJz.jpeg',
      ativo: true
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

  private normalizarPlaca(placa: string): string {
    return placa.trim().replace(/-/g, '').toUpperCase();
  }


  criar(dto: CriarVeiculoDTO): Observable<Veiculo> {
    const placa = this.normalizarPlaca(dto.placa);

    const placaExiste = this.veiculos.some(
      (veiculo) => this.normalizarPlaca(veiculo.placa) === placa
    );

    if (placaExiste) {
      return throwError(
        () => new Error('Já existe um veículo com essa placa.')
      );
    }

    const novo: Veiculo = {
      ...dto,
      placa,
      _id: Date.now().toString(),
      status: 'Veículo recebido - Aguardando Avaliação',
      ativo: true,
    };

    this.veiculos.push(novo);

    return of({ ...novo }).pipe(delay(500));
  }


  atualizar(
    id: string,
    dados: Partial<Veiculo>
  ): Observable<Veiculo> {
    const index = this.veiculos.findIndex((v) => v._id === id);

    if (index === -1) {
      return throwError(
        () => new Error('Veículo não encontrado.')
      );
    }

    if (!this.veiculos[index].ativo) {
      return throwError(
        () => new Error('Ative o veículo antes de editar.')
      );
    }


    const placa = this.normalizarPlaca(
      dados.placa ?? this.veiculos[index].placa
    );

    const placaExiste = this.veiculos.some(
      (veiculo) =>
        veiculo._id !== id &&
        this.normalizarPlaca(veiculo.placa) === placa
    );

    if (placaExiste) {
      return throwError(
        () => new Error('Já existe um veículo com essa placa.')
      );
    }

    this.veiculos[index] = {
      ...this.veiculos[index],
      ...dados,
      placa,
    };

    return of({ ...this.veiculos[index] }).pipe(delay(500));
  }


  excluir(id: string): Observable<void> {
    const veiculo = this.veiculos.find((v) => v._id === id);

    if (!veiculo) {
      return throwError(
        () => new Error('Veículo não encontrado.')
      );
    }

    veiculo.ativo = false;

    return of(undefined).pipe(delay(500));
  }


  reativar(id: string): Observable<void> {
    const veiculo = this.veiculos.find((v) => v._id === id);

    if (!veiculo) {
      return throwError(
        () => new Error('Veículo não encontrado.')
      );
    }

    veiculo.ativo = true;

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
