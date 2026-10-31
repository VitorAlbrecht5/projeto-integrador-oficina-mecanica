import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Veiculo } from './schemas/veiculo.schema';
import { CriarVeiculoDto } from './dto/criar-veiculo.dto';
import { AtualizarVeiculoDto } from './dto/atualizar-veiculo.dto';

@Injectable()
export class VeiculosService {
  constructor(
    @InjectModel(Veiculo.name)
    private readonly veiculoModel: Model<Veiculo>,
  ) {}

  // Lista todos os veículos ou filtra pela placa
  async listar(placa?: string) {
    const filtro = placa ? { placa: { $regex: placa, $options: 'i' } } : {};

    return this.veiculoModel.find(filtro).exec();
  }

  // Busca um veículo pelo ID
  async buscarPorId(id: string) {
    const veiculo = await this.veiculoModel.findById(id).exec();

    if (!veiculo) {
      throw new NotFoundException('Veículo não encontrado.');
    }

    return veiculo;
  }

  // Cadastra um novo veículo
  async criar(dados: CriarVeiculoDto) {
    this.validarAno(dados.ano);

    try {
      return await this.veiculoModel.create(dados);
    } catch (erro) {
      this.tratarErroDuplicidade(erro);
      throw erro;
    }
  }

  // Atualiza um veículo
  async atualizar(id: string, dados: AtualizarVeiculoDto) {
    await this.buscarPorId(id);
    this.validarAno(dados.ano);

    try {
      const veiculo = await this.veiculoModel
        .findByIdAndUpdate(id, dados, {
          new: true,
          runValidators: true,
        })
        .exec();

      return veiculo;
    } catch (erro) {
      this.tratarErroDuplicidade(erro);
      throw erro;
    }
  }

  // Remove um veículo
  async remover(id: string) {
    const veiculo = await this.veiculoModel.findByIdAndDelete(id).exec();

    if (!veiculo) {
      throw new NotFoundException('Veículo não encontrado.');
    }

    return { mensagem: 'Veículo removido com sucesso.' };
  }

  // Valida o ano de fabricação
  private validarAno(ano?: number) {
    if (ano !== undefined && ano > new Date().getFullYear() + 1) {
      throw new BadRequestException(
        'O ano do veículo não pode ser maior que o ano atual + 1.',
      );
    }
  }

  // Trata placas duplicadas no MongoDB
  private tratarErroDuplicidade(erro: unknown) {
    if (
      typeof erro === 'object' &&
      erro !== null &&
      'code' in erro &&
      erro.code === 11000
    ) {
      throw new ConflictException('Já existe um veículo com essa placa.');
    }
  }
}
