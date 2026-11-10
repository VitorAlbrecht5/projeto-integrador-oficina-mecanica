import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Servico, ServicoDocument } from './servico.schema';
import { CriarServicoDto } from './criar-servico.dto';
import { AtualizarServicoDto } from './atualizar-servico.dto';

@Injectable()
export class ServicosService {
  private readonly logger = new Logger(ServicosService.name);
  constructor(
    @InjectModel(Servico.name) private servicoModel: Model<ServicoDocument>,
  ) {}

  async criar(dados: CriarServicoDto): Promise<Servico> {
    const novoServico = new this.servicoModel(dados);
    const criado = await novoServico.save();
    this.logger.log(`Serviço cadastrado: ${String(criado._id)}`);
    return criado;
  }

  async listarTodos(): Promise<Servico[]> {
    return this.servicoModel.find().exec();
  }

  async buscarPorId(id: string): Promise<Servico> {
    const servico = await this.servicoModel.findById(id).exec();
    if (!servico) {
      throw new NotFoundException(`Serviço com ID ${id} não foi encontrado.`);
    }
    return servico;
  }

  async atualizar(id: string, dados: AtualizarServicoDto): Promise<Servico> {
    const servicoAtualizado = await this.servicoModel
      .findByIdAndUpdate(id, dados, { new: true, runValidators: true })
      .exec();

    if (!servicoAtualizado) {
      throw new NotFoundException(
        `Serviço com ID ${id} não foi encontrado para atualizar.`,
      );
    }
    this.logger.log(`Serviço atualizado: ${id}`);
    return servicoAtualizado;
  }

  async remover(id: string): Promise<void> {
    const resultado = await this.servicoModel.findByIdAndDelete(id).exec();
    if (!resultado) {
      throw new NotFoundException(
        `Serviço com ID ${id} não foi encontrado para exclusão.`,
      );
    }
    this.logger.log(`Serviço removido: ${id}`);
  }
}
