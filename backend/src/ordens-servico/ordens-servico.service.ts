import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import {
  OrdemServico,
  STATUS_ORDEM,
  type StatusOrdem,
} from './ordem-servico.schema';
import { Veiculo } from '../veiculos/schemas/veiculo.schema';
import { Servico } from '../servicos/servico.schema';
import { CriarOrdemServicoDto } from './dto/criar-ordem-servico.dto';
import { AtualizarOrdemServicoDto } from './dto/atualizar-ordem-servico.dto';

const TRANSICOES: Record<StatusOrdem, StatusOrdem[]> = {
  'Na Fila': ['Em Conserto', 'Aguardando Peça', 'Pronto'],
  'Em Conserto': ['Aguardando Peça', 'Pronto'],
  'Aguardando Peça': ['Em Conserto', 'Pronto'],
  Pronto: [],
};

@Injectable()
export class OrdensServicoService {
  private readonly logger = new Logger(OrdensServicoService.name);
  constructor(
    @InjectModel(OrdemServico.name) private readonly model: Model<OrdemServico>,
    @InjectModel(Veiculo.name) private readonly veiculos: Model<Veiculo>,
    @InjectModel(Servico.name) private readonly servicos: Model<Servico>,
  ) {}

  listar(status?: string) {
    if (status && !STATUS_ORDEM.includes(status as StatusOrdem)) {
      throw new BadRequestException('Status de OS inválido.');
    }
    const statusValidado = status as StatusOrdem | undefined;
    return this.model
      .find(statusValidado ? { status: statusValidado } : {})
      .sort({ dataEntrada: -1 })
      .exec();
  }

  async obterPorId(id: string) {
    this.validarId(id);
    const ordem = await this.model.findById(id).exec();
    if (!ordem) throw new NotFoundException('Ordem de serviço não encontrada.');
    return ordem;
  }

  async criar(dados: CriarOrdemServicoDto) {
    this.validarId(dados.veiculoId);
    const veiculo = await this.veiculos
      .findOne({ _id: dados.veiculoId, ativo: true })
      .exec();
    if (!veiculo) throw new BadRequestException('Selecione um veículo ativo.');
    const existente = await this.model
      .findOne({
        veiculoId: new Types.ObjectId(dados.veiculoId),
        status: { $ne: 'Pronto' },
      })
      .exec();
    if (existente)
      throw new ConflictException('O veículo já possui uma OS em andamento.');
    await this.validarServicos(dados.servicosIds ?? []);
    const nova = await this.model.create({
      veiculoId: new Types.ObjectId(dados.veiculoId),
      clienteId: veiculo.clienteId,
      descricaoProblema: dados.descricaoProblema,
      servicosIds: (dados.servicosIds ?? []).map(
        (id) => new Types.ObjectId(id),
      ),
      status: 'Na Fila',
    });
    // Uma OS recém-aberta inicia o acompanhamento na fila.
    await this.veiculos
      .findByIdAndUpdate(
        dados.veiculoId,
        { status: 'Na Fila' },
        { runValidators: true },
      )
      .exec();
    this.logger.log(`Atendimento aberto: ${String(nova._id)}`);
    return nova;
  }

  async atualizar(id: string, dados: AtualizarOrdemServicoDto) {
    const atual = await this.obterPorId(id);
    if (atual.status === 'Pronto') {
      throw new BadRequestException('Ordem finalizada não pode ser editada.');
    }
    const novoStatus = dados.status ?? atual.status;
    if (
      novoStatus !== atual.status &&
      !TRANSICOES[atual.status].includes(novoStatus)
    ) {
      throw new BadRequestException(
        `Transição de ${atual.status} para ${novoStatus} não permitida.`,
      );
    }
    const servicosIds =
      dados.servicosIds ?? atual.servicosIds.map((id) => id.toString());
    await this.validarServicos(servicosIds);
    const veiculo = await this.veiculos
      .findOne({ _id: atual.veiculoId, ativo: true })
      .exec();
    if (!veiculo)
      throw new BadRequestException('O veículo desta OS não está ativo.');
    const alteracoes = {
      ...(dados.descricaoProblema !== undefined
        ? { descricaoProblema: dados.descricaoProblema }
        : {}),
      ...(dados.servicosIds !== undefined
        ? { servicosIds: servicosIds.map((x) => new Types.ObjectId(x)) }
        : {}),
      status: novoStatus,
    };
    // O controller não manda uma segunda requisição: o service é responsável pelos dois registros.
    // Em produção, use uma transação MongoDB/replica set para atomicidade completa.
    const ordem = await this.model
      .findByIdAndUpdate(id, alteracoes, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!ordem) throw new NotFoundException('Ordem de serviço não encontrada.');
    await this.veiculos
      .findByIdAndUpdate(
        atual.veiculoId,
        { status: novoStatus },
        {
          runValidators: true,
        },
      )
      .exec();
    if (novoStatus !== atual.status) {
      this.logger.log(
        `Atendimento ${id}: status ${atual.status} -> ${novoStatus}`,
      );
    } else {
      this.logger.log(`Atendimento atualizado: ${id}`);
    }
    return ordem;
  }

  private validarId(id: string): void {
    if (!isValidObjectId(id)) throw new BadRequestException('ID inválido.');
  }

  private async validarServicos(ids: string[]): Promise<void> {
    if (
      new Set(ids).size !== ids.length ||
      ids.some((id) => !isValidObjectId(id))
    ) {
      throw new BadRequestException('Lista de serviços inválida.');
    }
    if (ids.length === 0) return;
    const quantidade = await this.servicos
      .countDocuments({ _id: { $in: ids } })
      .exec();
    if (quantidade !== ids.length)
      throw new BadRequestException('Selecione serviços cadastrados.');
  }
}
