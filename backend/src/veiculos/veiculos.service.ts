import {
  BadRequestException, ConflictException, Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Veiculo } from './schemas/veiculo.schema';
import { Cliente } from '../clientes/schemas/cliente.schema';
import { OrdemServico } from '../ordens-servico/ordem-servico.schema';
import { Servico } from '../servicos/servico.schema';
import { CriarVeiculoDto } from './dto/criar-veiculo.dto';
import { AtualizarVeiculoDto } from './dto/atualizar-veiculo.dto';
import { normalizarPlaca } from './normalizar-placa';

@Injectable()
export class VeiculosService {
  constructor(
    @InjectModel(Veiculo.name) private readonly veiculoModel: Model<Veiculo>,
    @InjectModel(Cliente.name) private readonly clienteModel: Model<Cliente>,
    @InjectModel(OrdemServico.name) private readonly ordemModel: Model<OrdemServico>,
    @InjectModel(Servico.name) private readonly servicoModel: Model<Servico>,
  ) {}

  listar(placa?: string) {
    if (!placa) return this.veiculoModel.find({}).exec();
    const normalizada = normalizarPlaca(placa);
    if (typeof normalizada !== 'string') {
      throw new BadRequestException('Informe uma placa válida.');
    }
    return this.veiculoModel.find({ placa: normalizada }).exec();
  }

  async consultarPorPlaca(placa: string) {
    const normalizada = normalizarPlaca(placa);
    if (typeof normalizada !== 'string' ||
        !/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(normalizada)) {
      throw new BadRequestException('Informe uma placa válida.');
    }

    // A consulta pública não retorna identificadores do cliente ou dados pessoais.
    // As observações exibidas publicamente são da última ordem de serviço.
    const veiculo = await this.veiculoModel.findOne({
      placa: normalizada, ativo: true,
    }).select('placa modelo status imagemUrl').lean().exec();
    if (!veiculo) throw new NotFoundException('Veículo não encontrado.');

    // Um veículo pode ter várias ordens, mas exibimos apenas os serviços da mais recente.
    // Assim, um atendimento antigo não é somado ao custo do atendimento atual.
    const ultimaOrdem = await this.ordemModel.findOne({ veiculoId: veiculo._id })
      .sort({ dataEntrada: -1, _id: -1 })
      .select('descricaoProblema servicosIds')
      .lean()
      .exec();

    const ids = ultimaOrdem?.servicosIds ?? [];
    const encontrados = ids.length
      ? await this.servicoModel.find({ _id: { $in: ids } })
          .select('nome preco')
          .lean()
          .exec()
      : [];
    const porId = new Map(encontrados.map(s => [String(s._id), s]));
    const servicos = ids.flatMap(id => {
      const servico = porId.get(String(id));
      return servico ? [{ nome: servico.nome, preco: servico.preco }] : [];
    });
    const totalEstimado = Math.round(servicos.reduce((total, servico) =>
      total + servico.preco, 0) * 100) / 100;

    return {
      placa: veiculo.placa,
      modelo: veiculo.modelo,
      status: veiculo.status,
      imagemUrl: veiculo.imagemUrl,
      observacao: ultimaOrdem?.descricaoProblema?.trim() || undefined,
      servicos,
      totalEstimado,
    };
  }

  async buscarPorId(id: string) {
    this.validarId(id);
    const veiculo = await this.veiculoModel.findById(id).exec();
    if (!veiculo) throw new NotFoundException('Veículo não encontrado.');
    return veiculo;
  }

  async criar(dados: CriarVeiculoDto) {
    this.validarAno(dados.ano);
    await this.validarCliente(dados.clienteId);
    if (dados.status === 'Pronto') {
      throw new BadRequestException('Conclua a ordem de serviço antes de marcar o veículo como Pronto.');
    }
    try {
      return await this.veiculoModel.create(dados);
    } catch (erro: unknown) {
      this.tratarErroDuplicidade(erro);
      throw erro;
    }
  }

  async atualizar(id: string, dados: AtualizarVeiculoDto) {
    const atual = await this.buscarPorId(id);
    if (!atual.ativo) throw new BadRequestException('Ative o veículo antes de editar.');
    if (dados.placa !== undefined && normalizarPlaca(dados.placa) !== normalizarPlaca(atual.placa)) {
      throw new BadRequestException('A placa do veículo não pode ser alterada.');
    }
    if (dados.status === 'Pronto' && atual.status !== 'Pronto') {
      throw new BadRequestException('A conclusão deve ser validada pela ordem de serviço.');
    }
    this.validarAno(dados.ano);
    if (dados.clienteId !== undefined) await this.validarCliente(dados.clienteId);

    try {
      const veiculo = await this.veiculoModel.findByIdAndUpdate(
        id, dados, { new: true, runValidators: true },
      ).exec();
      if (!veiculo) throw new NotFoundException('Veículo não encontrado.');
      return veiculo;
    } catch (erro: unknown) {
      this.tratarErroDuplicidade(erro);
      throw erro;
    }
  }

  async remover(id: string) {
    this.validarId(id);
    const veiculo = await this.veiculoModel.findByIdAndUpdate(
      id, { ativo: false }, { new: true, runValidators: true },
    ).exec();
    if (!veiculo) throw new NotFoundException('Veículo não encontrado.');
    return { mensagem: 'Veículo desativado com sucesso.' };
  }

  async reativar(id: string) {
    this.validarId(id);
    const veiculo = await this.veiculoModel.findByIdAndUpdate(
      id, { ativo: true }, { new: true, runValidators: true },
    ).exec();
    if (!veiculo) throw new NotFoundException('Veículo não encontrado.');
    return { mensagem: 'Veículo reativado com sucesso.' };
  }

  private async validarCliente(id: string): Promise<void> {
    if (!isValidObjectId(id)) throw new BadRequestException('ID de cliente inválido.');
    const cliente = await this.clienteModel.findOne({ _id: id, ativo: true }).exec();
    if (!cliente) throw new BadRequestException('Selecione um cliente ativo cadastrado.');
  }

  private validarId(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('ID de veículo inválido.');
  }

  private validarAno(ano?: number) {
    if (ano !== undefined && ano > new Date().getFullYear() + 1) {
      throw new BadRequestException('O ano do veículo não pode ser maior que o ano atual + 1.');
    }
  }

  private tratarErroDuplicidade(erro: unknown) {
    if (typeof erro === 'object' && erro !== null && 'code' in erro && erro.code === 11000) {
      throw new ConflictException('Já existe um veículo com essa placa.');
    }
  }
}
