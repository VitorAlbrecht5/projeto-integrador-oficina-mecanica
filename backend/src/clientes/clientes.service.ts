import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Cliente } from './schemas/cliente.schema';
import { CriarClienteDto } from './dto/criar-cliente.dto';
import { AtualizarClienteDto } from './dto/atualizar-cliente.dto';

@Injectable()
export class ClientesService {
  private readonly logger = new Logger(ClientesService.name);
  constructor(
    @InjectModel(Cliente.name) private readonly model: Model<Cliente>,
  ) {}

  listar() {
    return this.model.find({ ativo: true }).sort({ nomeCompleto: 1 }).exec();
  }

  async buscarPorId(id: string) {
    this.validarId(id);
    const cliente = await this.model.findOne({ _id: id, ativo: true }).exec();
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    return cliente;
  }

  async criar(dados: CriarClienteDto) {
    try {
      const cliente = await this.model.create(dados);
      this.logger.log(`Cliente cadastrado: ${String(cliente._id)}`);
      return cliente;
    } catch (erro: unknown) {
      this.verificarCpfDuplicado(erro);
      throw erro;
    }
  }

  async atualizar(id: string, dados: AtualizarClienteDto) {
    await this.buscarPorId(id);
    try {
      const atualizado = await this.model
        .findOneAndUpdate({ _id: id, ativo: true }, dados, {
          new: true,
          runValidators: true,
        })
        .exec();
      if (!atualizado) throw new NotFoundException('Cliente não encontrado.');
      this.logger.log(`Cliente atualizado: ${id}`);
      return atualizado;
    } catch (erro: unknown) {
      this.verificarCpfDuplicado(erro);
      throw erro;
    }
  }

  async desativar(id: string) {
    await this.buscarPorId(id);
    const cliente = await this.model
      .findOneAndUpdate(
        { _id: id, ativo: true },
        { ativo: false },
        { new: true, runValidators: true },
      )
      .exec();
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    this.logger.log(`Cliente desativado: ${id}`);
    return { mensagem: 'Cliente desativado com sucesso.' };
  }

  private validarId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID de cliente inválido.');
    }
  }

  private verificarCpfDuplicado(erro: unknown) {
    if (
      typeof erro === 'object' &&
      erro !== null &&
      'code' in erro &&
      erro.code === 11000
    ) {
      throw new ConflictException('Já existe um cliente com esse CPF.');
    }
  }
}
