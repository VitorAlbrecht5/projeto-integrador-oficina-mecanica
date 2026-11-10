import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usuarios: UsuariosService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, senha: string) {
    const usuario = await this.usuarios.buscarPorEmailComSenha(email);

    let confere = false;

    if (
      usuario &&
      usuario.perfil === 'admin' &&
      Buffer.byteLength(senha, 'utf8') <= 72
    ) {
      confere = await compare(senha, usuario.senhaHash);
    }

    if (!usuario || !confere) {
      // Não registrar endereço de e-mail ou senha em logs.
      this.logger.warn('Tentativa de login recusada');
      throw new UnauthorizedException('Credenciais inválidas');
    }
    this.logger.log(`Login realizado: usuário ${usuario._id}`);

    const accessToken = await this.jwt.signAsync({
      sub: usuario._id,
      nome: usuario.nome,
      perfil: usuario.perfil,
    });

    return {
      accessToken,
      usuario: {
        _id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    };
  }
}
