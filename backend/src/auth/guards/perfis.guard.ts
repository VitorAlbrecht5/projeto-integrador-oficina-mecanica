import {
  ForbiddenException,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERFIS } from '../decorators/perfis.decorator';
import { PUBLICO } from '../decorators/publico.decorator';

type RequisicaoAutenticada = {
  usuario?: {
    perfil: string;
  };
};

@Injectable()
export class PerfisGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(contexto: ExecutionContext): boolean {
    const alvos = [contexto.getHandler(), contexto.getClass()];

    const publica = this.reflector.getAllAndOverride<boolean>(PUBLICO, alvos);

    if (publica === true) return true;

    const perfis = this.reflector.getAllAndOverride<string[]>(PERFIS, alvos);

    if (!perfis?.length) return true;

    const { usuario } = contexto
      .switchToHttp()
      .getRequest<RequisicaoAutenticada>();

    if (usuario && perfis.includes(usuario.perfil)) {
      return true;
    }

    throw new ForbiddenException('Seu perfil não tem permissão para esta ação');
  }
}
