import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { isEmail } from 'class-validator';
import { Usuario, type Perfil } from './schemas/usuario.schema';

export interface CriarUsuario {
  nome: string;
  email: string;
  senha: string;
  perfil: Perfil;
}

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);
  constructor(
    @InjectModel(Usuario.name)
    private readonly model: Model<Usuario>,
  ) {}

  async criar(dto: CriarUsuario) {
    const email = dto.email.trim().toLowerCase();

    if (
      !isEmail(email) ||
      !dto.nome.trim() ||
      dto.senha.length < 6 ||
      Buffer.byteLength(dto.senha, 'utf8') > 72
    ) {
      throw new BadRequestException('Informe nome, e-mail e senha válidos.');
    }

    const existente = await this.model.findOne({ email }).lean().exec();

    if (existente) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    try {
      const criado = await this.model.create({
        nome: dto.nome.trim(),
        email,
        perfil: dto.perfil,
        senhaHash: await bcrypt.hash(dto.senha, 12),
      });

      const usuario = criado.toObject();

      this.logger.log(`Usuário criado: ${String(usuario._id)}`);
      return {
        _id: String(usuario._id),
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      };
    } catch (erro: unknown) {
      if (
        typeof erro === 'object' &&
        erro !== null &&
        'code' in erro &&
        erro.code === 11000
      ) {
        throw new ConflictException('E-mail já cadastrado.');
      }

      throw erro;
    }
  }

  async buscarPorEmailComSenha(emailInformado: string) {
    const email = emailInformado.trim().toLowerCase();

    const usuario = await this.model
      .findOne({ email })
      .select('+senhaHash +senha')
      .lean()
      .exec();

    if (!usuario) return null;

    return {
      _id: String(usuario._id),
      nome: usuario.nome || 'Administrador',
      email: usuario.email,
      perfil: usuario.perfil || 'admin',
      senhaHash: usuario.senhaHash || usuario.senha || '',
    };
  }
}
