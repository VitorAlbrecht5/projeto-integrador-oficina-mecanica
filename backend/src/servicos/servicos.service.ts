import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Servico, ServicoDocument } from './servico.schema';
import { CriarServicoDto } from './dto/criar-servico.dto';
import { AtualizarServicoDto } from './dto/atualizar-servico.dto';

@Injectable()
export class ServicosService {
  constructor(
    @InjectModel(Servico.name) private servicoModel: Model<ServicoDocument>,
  ) {}

  async criar(dto: CriarServicoDto): Promise<Servico> {
    // Regra: Garantir nome único para o serviço
    const existe = await this.servicoModel.exists({ nome: dto.nome });
    if (existe) {
      throw new ConflictException('Já existe um serviço cadastrado com este nome.');
    }
    const novoServico = new this.servicoModel(dto);
    return novoServico.save();
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

  async atualizar(id: string, dto: AtualizarServicoDto): Promise<Servico> {
    const servicoAtualizado = await this.servicoModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    
    if (!servicoAtualizado) {
      throw new NotFoundException(`Serviço com ID ${id} não foi encontrado para atualizar.`);
    }
    return servicoAtualizado;
  }

  async remover(id: string): Promise<void> {
    const resultado = await this.servicoModel.findByIdAndDelete(id).exec();
    if (!resultado) {
      throw new NotFoundException(`Serviço com ID ${id} não foi encontrado para exclusão.`);
    }
  }
}