import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface RespostaPadrao<T> {
  sucesso: true;
  dados: T;
}

@Injectable()
export class RespostaInterceptor<T> implements NestInterceptor<
  T,
  RespostaPadrao<T>
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<RespostaPadrao<T>> {
    const resposta: Observable<RespostaPadrao<T>> = next.handle().pipe(
      map((dados: T): RespostaPadrao<T> => ({
        sucesso: true,
        dados,
      })),
    );

    return resposta;
  }
}
