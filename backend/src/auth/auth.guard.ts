import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { PUBLICO } from './decorators/publico.decorator';

interface UsuarioToken {
  sub: string;
  nome: string;
  perfil: string;
  exp: number;
}

type RequisicaoAutenticada = Request & {
  usuario?: UsuarioToken;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const publica = this.reflector.getAllAndOverride<boolean>(PUBLICO, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);

    if (publica === true) return true;

    const request = contexto.switchToHttp().getRequest<RequisicaoAutenticada>();

    const [tipo, token, extra] =
      request.headers.authorization?.split(' ') ?? [];

    if (tipo !== 'Bearer' || !token || extra) {
      throw new UnauthorizedException('Token não informado');
    }

    try {
      const usuario = await this.jwt.verifyAsync<UsuarioToken>(token, {
        algorithms: ['HS256'],
      });

      if (
        typeof usuario.sub !== 'string' ||
        !usuario.sub ||
        typeof usuario.nome !== 'string' ||
        typeof usuario.perfil !== 'string' ||
        typeof usuario.exp !== 'number' ||
        !Number.isFinite(usuario.exp)
      ) {
        throw new Error('Token incompleto');
      }

      request.usuario = usuario;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
